import React, { useEffect, useState, useRef, forwardRef, useCallback, useMemo } from 'react';
import * as CodeMirror from 'codemirror/lib/codemirror';
import 'codemirror/mode/groovy/groovy';
import 'codemirror/mode/sql/sql';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/material.css';

import 'codemirror/addon/display/fullscreen.css';
import 'codemirror/addon/display/fullscreen.js';

import defineScript from './defineScript';

import './index.less';

const beautify_js = require('js-beautify').js_beautify;

import ScrollContainer from './ScrollContainer';
import ErrorPanel from './ErrorPanel';
//输入字段&函数排序先匹配最长的
const sortBy = (a, b) => {
    if (a.length > b.length) {
        return -1;
    }
    if (a.length < b.length) {
        return 1;
    }
    return 0;
};

let index = 0;
const getId = (type = 'formula-edit') => `${type}-${index++}`;

const FormulaEdit = forwardRef((props, ref) => {
    const {
        children,
        value = '',
        readOnly = false,
        theme = 'night',
        mode = 'defineScript',
        selectStyle = {
            width: '200px'
        },
        lineNumber = true,
        indentUnit = 2,
        regExp = '',
        isEndMark,
        height = 300,
        fieldList,
        typeMap = {},
        keyWords = ['int', 'double', 'string', 'list', 'boolean', 'if', 'else', 'and', 'or', 'return'],
        methodList,
        normalList,
        editorEvent,
        placeholder,
        cnCodeToEnExtraLogic,
        enCodeToCnExtraLogic,
        lang,
        searchCb,
        showErrorPanel = true, // 新增props：是否显示错误面板
        ...rest
    } = props;

    const [curState, setCurState] = useState({
        posLeft: 0,
        posTop: 0,
        tipShow: false,
        tipShowType: null
    });
    const [dropList, setDropList] = useState([]);
    const [currentErrors, setCurrentErrors] = useState([]); // 新增状态：当前错误列表

    // const [regExpState, setRegExpState] = useState('@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@]*');
    const regExpState = useMemo(() => {
        if (!regExp && (normalList || []).length) {
            let temp = normalList.map((res) => res.name);
            temp = temp.map((item) => item.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));
            temp = temp.join('');
            return `@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@${temp}]*`;
        }
        return '@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@]*';
    }, [regExp, normalList]);

    const codeMirrorEditor = useRef();
    const textareaRef = useRef();
    const fieldRegExpRef = useRef('');
    const funRegExpRef = useRef('');
    const funRegExpGRef = useRef('');
    const normalExpGRef = useRef('');
    const domId = useRef(getId());
    const modeType = useRef(getId('defineScript'));
    const modeField = useRef();
    const eventRef = useRef();
    const isInitializedRef = useRef(false);
    const isSettingValueRef = useRef(false);
    const errorCacheRef = useRef(null);
    const lastCheckedCodeRef = useRef('');

    const tntCodeMirrorRef = useRef()


    const _mode = mode === 'defineScript' ? modeType.current : mode;
    useEffect(() => {
        if (mode === 'defineScript') {
            defineScript(modeType.current, modeField);
        }
    }, [mode]);

    const { posLeft, posTop, tipShowType, tipShow } = curState;

    // 全屏
    const fullScreen = () => {
        codeMirrorEditor.current.setOption('fullScreen', !codeMirrorEditor.current.getOption('fullScreen'));
        codeMirrorEditor.current.focus();
    };

    // 退出全屏
    const exitFullScreen = () => {
        if (codeMirrorEditor.current.getOption('fullScreen')) {
            codeMirrorEditor.current.setOption('fullScreen', false);
        }
    };

    // 使用useMemo优化数组处理和正则表达式创建
    const memoizedArrays = useMemo(() => {
        const fArr = (fieldList || []).map((item) => `@${item.name.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}`);
        const mArr = (methodList || []).map((item) => `#${item.name}`).sort(sortBy);
        const nArr = (normalList || []).map((item) => item.name).sort(sortBy);
        const escapedArr = nArr.map((item) => item.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));
        
        return {
            fArr: fArr.sort(sortBy),
            mArr,
            nArr,
            escapedArr
        };
    }, [fieldList, methodList, normalList]);

    // 使用useMemo优化正则表达式创建
    const memoizedRegExps = useMemo(() => {
        const { fArr, mArr, escapedArr } = memoizedArrays;
        
        return {
            fieldRegExp: fArr.length ? new RegExp(`(${fArr.join('|')})`) : null,
            funRegExp: mArr.length ? new RegExp(`(${mArr.join('|')})`) : null,
            funRegExpG: mArr.length ? new RegExp(`(${mArr.join('|')})`, 'g') : null,
            normalExpG: escapedArr.length ? new RegExp(`(${escapedArr.join('|')})`, 'g') : null
        };
    }, [memoizedArrays]);

    // 使用useMemo优化modeField数据
    const memoizedModeField = useMemo(() => {
        // 内联getLocalList逻辑避免依赖问题
        const createLocalList = (list, type) => {
            const copyList = Object.assign([], list);
            // 排序，把长的放前面
            copyList.sort((a, b) => {
                if (a.name.length > b.name.length) {
                    return -1;
                }
                if (a.name.length < b.name.length) {
                    return 1;
                }
                return 0;
            });
            let codemirrorList = [];
            for (let i = 0; i < copyList.length; i++) {
                codemirrorList.push(`${type}${copyList[i].name}`);
            }
            return codemirrorList;
        };

        return {
            codemirrorFieldList: createLocalList(fieldList || [], '@'),
            codemirrorMethodList: createLocalList(methodList || [], '#'),
            codemirrorNormalList: createLocalList(normalList || [], ''),
            codemirrorKeywordList: keyWords
        };
    }, [fieldList, methodList, normalList, keyWords]);

    // 防抖工具函数
    const debounce = (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // 使用useMemo优化keywords拼接
    const memoizedKeywords = useMemo(() => {
        const mValueArr = (methodList || []).map((item) => `#${item.realValue}`);
        const nValueArr = (normalList || []).map((item) => item.value);
        const keywords = [...mValueArr, ...nValueArr].join('|');
        return {
            keywords,
            curRegExp: keywords ? new RegExp(`(${keywords})`, 'g') : null
        };
    }, [methodList, normalList]);

    const setLocalStorage = () => {
        // 字段存本地，供分词高亮使用
        modeField.current = memoizedModeField;
        
        // 使用缓存的正则表达式
        fieldRegExpRef.current = memoizedRegExps.fieldRegExp;
        funRegExpRef.current = memoizedRegExps.funRegExp;
        funRegExpGRef.current = memoizedRegExps.funRegExpG;
        normalExpGRef.current = memoizedRegExps.normalExpG;
    };

    useEffect(() => {
        setLocalStorage();
    }, [fieldList, methodList, normalList]);

    useEffect(() => {
        let turnTheme;
        let ops = {};
        if (theme === 'night') turnTheme = 'material';
        if (theme === 'day') turnTheme = '3024-day';
        if (_mode === 'groovy') {
            ops = {
                mode: 'text/x-groovy',
                indentUnit,
                extraKeys: {
                    Tab: (cm) => {
                        if (cm.somethingSelected()) {
                            // 存在文本选择
                            cm.indentSelection('add'); // 正向缩进文本
                        } else {
                            // 无文本选择
                            // cm.indentLine(cm.getCursor().line, "add");  // 整行缩进 不符合预期
                            cm.replaceSelection(Array(cm.getOption('indentUnit') + 1).join(' '), 'end', '+input'); // 光标处插入 indentUnit 个空格
                        }
                    },
                    'Shift-Tab': (cm) => {
                        // 反向缩进
                        if (cm.somethingSelected()) {
                            cm.indentSelection('subtract'); // 反向缩进
                        } else {
                            // cm.indentLine(cm.getCursor().line, "subtract");  // 直接缩进整行
                            const cursor = cm.getCursor();
                            cm.setCursor({ line: cursor.line, ch: cursor.ch - cm.getOption('indentUnit') }); // 光标回退 indexUnit 字符
                        }
                    },
                    'Ctrl-F': (cm) => {
                        const formatValue = beautify_js(cm.getValue(), {
                            indent_size: indentUnit,
                            indent_char: indentUnit === '1' ? '\t' : ' '
                        });
                        setValueSafely(formatValue);
                    }
                }
            };
        }

        if (!codeMirrorEditor.current) {
            codeMirrorEditor.current = CodeMirror.fromTextArea(textareaRef.current, {
                mode: _mode,
                theme: turnTheme,
                lineNumbers: lineNumber,
                lineWrapping: true,
                readOnly: readOnly ? 'nocursor' : false,
                ...ops,
                ...rest
            });
            
            // 初始化完成后设置标志
            isInitializedRef.current = true;
        }

        let codeValue = '';
        if (value) codeValue = EnCodeToCn(value);
        if (_mode === 'groovy') {
            codeMirrorEditor.current.off('changes', editorChanges);
        }
        setValueSafely(codeValue);
        codeMirrorEditor.current.setSize('auto', height);
        if (_mode === 'groovy') {
            codeMirrorEditor.current.on('changes', editorChanges);
        }

        editorEvent && editorEvent({ codeEditor: codeMirrorEditor.current, fullScreen, exitFullScreen, EnCodeToCn, CnCodeToEn });

        return () => {};
    }, [_mode, theme, lineNumber, readOnly, height, indentUnit]);

    useEffect(() => {
        if (codeMirrorEditor.current) {
            codeMirrorEditor.current.addKeyMap({
                Up: (cm) => {
                    enterFuc('up', cm);
                },
                Down: (cm) => {
                    enterFuc('down', cm);
                },
                Enter: (cm) => {
                    enterFuc('enter', cm);
                },
                Esc: () => {
                    exitFullScreen();
                },
                F9: () => {
                    fullScreen();
                }
            });
        }
    }, [tipShow]);

    useEffect(() => {
        if (!readOnly && codeMirrorEditor.current) {
            let codeValue = EnCodeToCn(value);
            insertValue(codeValue);
        }
    }, [readOnly, value]);

    useEffect(() => {
        if (codeMirrorEditor.current) {
            codeMirrorEditor.current.setSize('auto', height);
        }
    }, [height]);

    // 错误检测和收集功能
    const collectErrors = useCallback((cnCode) => {
        if (!codeMirrorEditor.current) return [];
        
        const errors = [];
        const doc = codeMirrorEditor.current.getDoc();
        
        // 检查各种错误类型
        const errorSelectors = [
            { selector: '.cm-nomal-keyword', type: 'syntax', message: '未识别的关键字' },
            { selector: '.cm-bracket-error', type: 'bracket', message: '括号不匹配' },
            { selector: '.cm-function-error', type: 'function', message: '函数缺少参数括号' },
            { selector: '.cm-string-error', type: 'string', message: '字符串未闭合' }
        ];
        
        errorSelectors.forEach(({ selector, type, message }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // 获取错误位置信息
                const lineElement = element.closest('.CodeMirror-line');
                if (lineElement) {
                    const lineNumber = Array.from(lineElement.parentNode.children).indexOf(lineElement);
                    errors.push({
                        type,
                        message,
                        line: lineNumber + 1,
                        severity: type === 'syntax' ? 'error' : 'warning',
                        text: element.textContent
                    });
                }
            });
        });
        
        return errors;
    }, []);

    const doChange = (cnCode) => {
        // 避免初始化时或程序设置值时触发change
        if (!isInitializedRef.current || isSettingValueRef.current) {
            return;
        }
        
        // 收集所有错误信息
        const detectedErrors = collectErrors(cnCode);
        setCurrentErrors(detectedErrors); // 更新错误状态
        
        // 优化错误检测：缓存结果，避免重复DOM查询
        let errorMsg = null;
        let hasErrors = detectedErrors.length > 0;
        
        if (lastCheckedCodeRef.current !== cnCode) {
            if (hasErrors) {
                // 生成详细的错误信息
                const errorSummary = detectedErrors.map(err => 
                    `第${err.line}行: ${err.message}${err.text ? ` (${err.text})` : ''}`
                ).join('; ');
                errorMsg = errorSummary;
            }
            errorCacheRef.current = errorMsg;
            lastCheckedCodeRef.current = cnCode;
        } else {
            errorMsg = errorCacheRef.current;
        }
        
        let enCode = CnCodeToEn(cnCode);
        const data = {
            cnCode,
            enCode,
            errorMsg,
            errors: detectedErrors, // 新增详细错误列表
            hasErrors
        };
        props.onChange(enCode, data);
    };

    // 安全的setValue函数，避免触发不必要的change事件
    const setValueSafely = (value) => {
        if (!codeMirrorEditor.current) return;
        
        isSettingValueRef.current = true;
        codeMirrorEditor.current.setValue(value);
        // 使用setTimeout确保所有change事件处理完毕后再重置标志
        setTimeout(() => {
            isSettingValueRef.current = false;
        }, 0);
    };

    eventRef.current = (cm) => {
        if (props.onChange) {
            const cnCode = cm.getValue();
            // 正则替换关键词
            doChange(cnCode);
        }
    };

    const editorChanges = useCallback((...args) => {
        if (eventRef.current) {
            eventRef.current.apply(null, args);
        }
    }, []);

    useEffect(() => {
        if (codeMirrorEditor.current && _mode !== 'groovy') {
            let codeValue = value;
            if (codeValue) codeValue = EnCodeToCn(codeValue);
            codeMirrorEditor.current.off('changes', editorChanges);
            setValueSafely(codeValue);
            codeMirrorEditor.current.on('changes', editorChanges);

            codeMirrorEditor.current.on('cursorActivity', (cm) => {
                debouncedCursorActivity(cm);
            });

            codeMirrorEditor.current.on('focus', (cm) => {
                // focus事件不需要防抖，立即执行
                cursorActivity(cm);
                setCurState({
                    ...curState
                });
            });
        }
        // 这里有异步问题
        // if (!regExp && (normalList || []).length) {
        //     let temp = normalList.map((res) => res.name);
        //     temp = temp.map((item) => item.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));
        //     temp = temp.join('');
        //     setRegExpState(`@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@${temp}]*`);
        // }
        if ((fieldList || []).length || (methodList || []).length || (normalList || []).length) {
            const codeValue = EnCodeToCn(value);
            doChange(codeValue);
        }
    }, [fieldList, methodList, normalList]);

    const insertValue = (value) => {
        if (readOnly || !value) return;
        const getCursor = codeMirrorEditor.current.getCursor();
        const curLine = getCursor.ch;
        codeMirrorEditor.current.setCursor(getCursor.line, curLine);
        // codeMirrorEditor.current.focus();
    };

    const getLocalList = (list, type) => {
        const copyList = Object.assign([], list);
        // 排序，把长的放前面
        copyList.sort((a, b) => {
            if (a.name.length > b.name.length) {
                return -1;
            }
            if (a.name.length < b.name.length) {
                return 1;
            }
            return 0;
        });
        let codemirrorList = [];
        for (let i = 0; i < copyList.length; i++) {
            codemirrorList.push(`${type}${copyList[i].name}`);
        }
        return codemirrorList;
    };

    const matchLetter = (match) => {
        let turnStr = match.replace(/^\s*|\s*$/g, '');

        const leadingSpacesMatch = match.match(/^\s*/);
        let leadingSpaces = '';
        if (leadingSpacesMatch && leadingSpacesMatch.length) {
            leadingSpaces = leadingSpacesMatch[0];
        }

        const trailingSpacesMatch = match.match(/\s*$/);
        let trailingSpaces = '';
        if (trailingSpacesMatch && trailingSpacesMatch.length) {
            trailingSpaces = trailingSpacesMatch[0];
        }
        return {
            turnStr,
            leadingSpaces,
            trailingSpaces
        };
    };

    const CnCodeToEn = (cnCode) => {
        const reg = new RegExp(regExp || regExpState, 'g');
        let enCode = cnCode.replace(reg, (match) => {
            let { turnStr, leadingSpaces, trailingSpaces } = matchLetter(match);

            const fItem = (fieldList || []).find((item) => `@${item.name}` === turnStr);
            if (fItem) {
                turnStr = `@${fItem.value}`;

                if (cnCodeToEnExtraLogic) {
                    const cnCodeTemp = cnCodeToEnExtraLogic(fItem);
                    if (cnCodeTemp) {
                        turnStr = cnCodeTemp + turnStr;
                    }
                }
            }
            return leadingSpaces + turnStr + trailingSpaces;
        });
        enCode = enCode.replace(funRegExpGRef.current, (match) => {
            let turnStr = match;
            const mItem = (methodList || []).find((item) => `#${item.name}` === match);
            if (mItem) turnStr = `#${mItem.realValue}`;
            return turnStr;
        });

        enCode = enCode.replace(normalExpGRef.current, (match) => {
            let turnStr = match;
            const nItem = (normalList || []).find((item) => item.name === match);
            if (nItem) turnStr = nItem.value;
            return turnStr;
        });
        return enCode;
    };

    const EnCodeToCn = (enCode) => {
        const reg = new RegExp(regExp || regExpState, 'g');
        const { curRegExp } = memoizedKeywords;
        let cnCode = enCode.replace(reg, (match) => {
            let { turnStr, leadingSpaces, trailingSpaces } = matchLetter(match);
            const fItem = (fieldList || []).find((item) => `@${item.value}` === turnStr);
            if (fItem) turnStr = `@${fItem.name}`;
            return leadingSpaces + turnStr + trailingSpaces;
        });

        if (enCodeToCnExtraLogic) {
            const cnCodeTemp = enCodeToCnExtraLogic(cnCode);
            if (cnCodeTemp) {
                cnCode = cnCodeTemp;
            }
        }

        if (curRegExp) {
            cnCode = cnCode.replace(curRegExp, (match) => {
                let turnStr = match;
                const mItem = (methodList || []).find((item) => `#${item.realValue}` === match);
                if (mItem) turnStr = `#${mItem.name}`;
                const nItem = (normalList || []).find((item) => item.value === match);
                if (nItem) turnStr = nItem.name;
                return turnStr;
            });
        }
        return cnCode;
    };

    // 创建防抖版本的关键函数
    const debouncedCursorActivity = useMemo(() => debounce((cm) => {
        cursorActivity(cm);
    }, 100), []);

    const debouncedSearch = useMemo(() => debounce((val, type, methodParamsInfo) => {
        search(val, type, methodParamsInfo);
    }, 150), []);

    const cursorActivity = (cm) => {
        if (readOnly) return;

        const getCursor = cm.getCursor();
        const pos = cm.cursorCoords(getCursor);
        const getLineInfo = cm.getLine(getCursor.line);
        const cursorBeforeOneChar = getLineInfo.substring(0, getCursor.ch);
        const lastIndex = cursorBeforeOneChar.lastIndexOf('@', getCursor.ch);
        const lastIndex2 = cursorBeforeOneChar.lastIndexOf('#', getCursor.ch);

        let methodParamsInfo = '';
        if (lastIndex2 > -1) {
            methodParamsInfo = cursorBeforeOneChar.substring(lastIndex2, getCursor.ch);
        }

        let { left, top  } = pos || {};

        if(selectStyle){
            const defaultWidth = selectStyle.width ? Number(selectStyle.width.replace("px",'')) : 0;
            const { x, width } = tntCodeMirrorRef.current ? tntCodeMirrorRef.current.getBoundingClientRect() : {};

            if(left + defaultWidth >= x + width){
                left = left - defaultWidth + ( width - left ) + x
            }
        }


        const scrollDiv = tntCodeMirrorRef.current.querySelector('#scrollDiv');
        let scrollDivHeight = 200
        if(scrollDiv){
            scrollDivHeight = scrollDiv.getBoundingClientRect().height;
        }
        if(document.body.clientHeight - top < scrollDivHeight){
            top = top - scrollDivHeight - 20
        }
        top = top + 20


        if (fieldList && fieldList.length > 0 && lastIndex !== -1 && lastIndex > lastIndex2) {
            // 监测@
            const content = cursorBeforeOneChar.substring(lastIndex + 1, getCursor.ch);
            const findObj = fieldList.find((item) => item.name.includes(content));
            if (findObj) {
                const temp = {
                    ...curState,
                    posLeft: left,
                    posTop: top,
                    tipShow: true,
                    tipShowType: '@'
                };
                setCurState(temp);
                debouncedSearch(content, '@', methodParamsInfo);
            } else {
                setCurState({
                    ...curState,
                    tipShow: false,
                    tipShowType: null
                });
            }
        }
        if (methodList && methodList.length > 0 && lastIndex2 !== -1 && lastIndex2 > lastIndex) {
            // 监测#
            const content = cursorBeforeOneChar.substring(lastIndex2 + 1, getCursor.ch);
            const findObj = methodList.find((item) => item.name.includes(content));
            if (findObj) {
                setCurState({
                    ...curState,
                    posLeft: left,
                    posTop: top,
                    tipShow: true,
                    tipShowType: '#'
                });
                debouncedSearch(content, '#', methodParamsInfo);
            } else {
                setCurState({
                    ...curState,
                    tipShow: false,
                    tipShowType: null
                });
            }
        }
        if (!cursorBeforeOneChar.includes('@') && !cursorBeforeOneChar.includes('#')) {
            setCurState({
                ...curState,
                tipShow: false,
                tipShowType: null
            });
        }
    };

    const search = useCallback((val, type, methodParamsInfo) => {
        let list = [];
        let searchList = type === '@' ? fieldList || [] : methodList || [];
        if (searchCb) {
            searchList = searchCb({ field: val, type, methodParamsInfo, fieldList, methodList, searchList, CnCodeToEn, EnCodeToCn });
        }
        if (searchList && searchList.length) {
            searchList.forEach((item) => {
                if (item.name.includes(val)) {
                    list.push(item);
                }
            });
        }
        setDropList(list);
    }, [fieldList, methodList, searchCb, CnCodeToEn, EnCodeToCn]);

    const handleClick = useCallback((item, type) => {
        const getCursor = codeMirrorEditor.current.getCursor(); // 焦点
        const getLineInfo = codeMirrorEditor.current.getLine(getCursor.line); // 当前行数据
        const cursorBeforeOneChar = getLineInfo.substring(0, getCursor.ch); // 起始到当前焦点数据
        const lastIndex = cursorBeforeOneChar.lastIndexOf(type, getCursor.ch); // 最后一个标记位置
        const cursorAfterOneChar = getLineInfo.substring(lastIndex, getLineInfo.length); // 最后一个标记到结尾数据
        let endIndex = getCursor.ch;
        if (type === '@' || type === '#') {
            const regExpRef = type === '@' ? fieldRegExpRef.current : funRegExpRef.current;
            const match = cursorAfterOneChar.match(regExpRef);
            if (match && match.index === 0) {
                // 第一个匹配的
                endIndex = lastIndex + match[0].length;
            }
        }
        codeMirrorEditor.current.setSelection({ line: getCursor.line, ch: lastIndex + 1 }, { line: getCursor.line, ch: endIndex });
        let content = '';
        let offsetIndex = 0;
        if (type === '@') {
            content = item.name + (isEndMark ? '@' : '');
            // 好像不通用，暂时隐藏
            // if ([',', ')'].includes(getLineInfo[endIndex])) {
            // 	// 如果后面是逗号或者括号，聚焦到后面
            // 	offsetIndex = 1;
            // }
        } else if (type === '#' && getLineInfo.length > endIndex) {
            content = item.name;
        } else {
            content = item.value;
        }
        if (type === '#' && content.includes(',')) {
            // 函数聚焦到逗号前面
            offsetIndex = content.indexOf(',') - content.length;
        }
        codeMirrorEditor.current.replaceSelection(content);
        codeMirrorEditor.current.setCursor(getCursor.line, lastIndex + 1 + content.length + offsetIndex);
        codeMirrorEditor.current.focus();
        setCurState({
            ...curState,
            tipShow: false,
            tipShowType: null
        });
    }, [isEndMark, curState]);

    const enterFuc = (type, cm) => {
        if (!tipShow) {
            if (type === 'up') {
                cm.execCommand('goLineUp');
            } else if (type === 'down') {
                cm.execCommand('goLineDown');
            } else if (type === 'enter') {
                cm.execCommand('newlineAndIndent');
            }
            return false;
        }
        let findLi = 'cm-field-li';
        let active = 'cm-active';
        const rootDom = document.getElementById(domId.current) || document.body;
        const nodeList = rootDom.querySelectorAll(`.${findLi}`);
        const length = nodeList.length;
        let index = 0;
        let hasActive = false;
        for (let i = 0; i < length; i++) {
            if (nodeList[i].className.includes(active)) {
                index = i;
                hasActive = true;
            }
        }
        if (type === 'up') {
            nodeList[index].className = findLi;
            if (index === 0) {
                nodeList[0].className = `${active} ${findLi}`;
            } else {
                nodeList[index - 1].className = `${active} ${findLi}`;
            }
            rootDom.querySelector(`.${active}`).scrollIntoViewIfNeeded();
        } else if (type === 'down') {
            nodeList[index].setAttribute('class', findLi);
            if (index === length - 1) {
                nodeList[index].setAttribute('class', `${active} ${findLi}`);
            } else {
                nodeList[index + 1].setAttribute('class', `${active} ${findLi}`);
            }
            rootDom.querySelector(`.${active}`).scrollIntoViewIfNeeded();
        } else if (type === 'enter') {
            let node = document.querySelector(`.${active}`);
            if (!(node.attributes && node.attributes.data && node.attributes.data.value)) {
                node = nodeList[index];
            }
            handleClick(
                {
                    name: node.title,
                    value: node.attributes.data.value
                },
                tipShowType
            );
            setTimeout(() => {
                setCurState({
                    ...curState,
                    tipShow: false,
                    tipShowType: null
                });
            }, 100);
        }
    };

    return (
        <div className="tnt-codemirror" ref={tntCodeMirrorRef}>
            {children}
            <textarea ref={textareaRef} />
            {placeholder && !value && <a className="placeholder">{placeholder}</a>}

            {/* @弹框 */}
            {tipShow ? (
                <ScrollContainer
                    theme={theme} //主题样式
                    dropList={dropList} //加载的数据
                    listLen={dropList.length} //加载的数据长度
                    listSize={20} //下拉列表一次显示多少条 默认20
                    itemHeight={30} //下拉列表单项高度 默认30
                    typeMap={typeMap}
                    selectChange={(item) => {
                        handleClick(item, tipShowType);
                    }}
                    style={{
                        left: `${posLeft}px`,
                        top: `${posTop}px`,
                        ...selectStyle
                    }}
                    lang={lang}
                    domId={domId.current}
                />
            ) : (
                ''
            )}

            {/* 错误提示面板 */}
            {showErrorPanel && currentErrors.length > 0 && (
                <ErrorPanel 
                    errors={currentErrors}
                    theme={theme}
                    visible={true}
                />
            )}
        </div>
    );
});

export default FormulaEdit;
