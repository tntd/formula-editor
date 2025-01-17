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
        ...rest
    } = props;

    const [curState, setCurState] = useState({
        posLeft: 0,
        posTop: 0,
        tipShow: false,
        tipShowType: null
    });
    const [dropList, setDropList] = useState([]);

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

    const setLocalStorage = () => {
        // 字段存本地，供分词高亮使用
        modeField.current = {
            codemirrorFieldList: getLocalList(fieldList || [], '@'),
            codemirrorMethodList: getLocalList(methodList || [], '#'),
            codemirrorNormalList: getLocalList(normalList || [], ''),
            codemirrorKeywordList: keyWords
        };
        const fArr = (fieldList || []).map((item) => `@${item.name.replace(/\[/g, '\\[').replace(/\]/g, '\\]')}`);
        const mArr = (methodList || []).map((item) => `#${item.name}`).sort(sortBy);
        const nArr = (normalList || []).map((item) => item.name).sort(sortBy);
        // const keywords = [...mArr, ...nArr];
        fieldRegExpRef.current = new RegExp(`(${fArr.sort(sortBy).join('|')})`);
        funRegExpRef.current = new RegExp(`(${mArr.join('|')})`);
        funRegExpGRef.current = new RegExp(`(${mArr.join('|')})`, 'g');
        // 对特殊字符进行转移转译
        const escapedArr = nArr.map((item) => item.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&'));
        normalExpGRef.current = new RegExp(`(${escapedArr.join('|')})`, 'g'); // normal 不能以引号开头
        // normalExpGRef.current = new RegExp(`(?<!\\S)(${nArr.join('|')})(?!\\S)`,'g');
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
                        codeMirrorEditor.current.setValue(formatValue);
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
        }

        let codeValue = '';
        if (value) codeValue = EnCodeToCn(value);
        if (_mode === 'groovy') {
            codeMirrorEditor.current.off('changes', editorChanges);
        }
        codeMirrorEditor.current.setValue(codeValue);
        codeMirrorEditor.current.setSize('auto', height);
        if (_mode === 'groovy') {
            codeMirrorEditor.current.on('changes', editorChanges);
        }

        editorEvent && editorEvent({ codeEditor: codeMirrorEditor.current, fullScreen, exitFullScreen, EnCodeToCn, CnCodeToEn });

        return () => {};
    }, []);

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

    const doChange = (cnCode) => {
        const errorKeyword = document.body.querySelector('.cm-nomal-keyword');
        let enCode = CnCodeToEn(cnCode);
        const data = {
            cnCode,
            enCode,
            errorMsg: errorKeyword ? '存在错误代码' : null
        };
        props.onChange(enCode, data);
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
            codeMirrorEditor.current.setValue(codeValue);
            codeMirrorEditor.current.on('changes', editorChanges);

            codeMirrorEditor.current.on('cursorActivity', (cm) => {
                cursorActivity(cm);
            });

            codeMirrorEditor.current.on('focus', (cm) => {
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
        const mValueArr = (methodList || []).map((item) => `#${item.realValue}`);
        const nValueArr = (normalList || []).map((item) => item.value);
        const keywords = [...mValueArr, ...nValueArr].join('|');
        const curRegExp = new RegExp(`(${keywords})`, 'g');
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

        cnCode = cnCode.replace(curRegExp, (match) => {
            let turnStr = match;
            const mItem = (methodList || []).find((item) => `#${item.realValue}` === match);
            if (mItem) turnStr = `#${mItem.name}`;
            const nItem = (normalList || []).find((item) => item.value === match);
            if (nItem) turnStr = nItem.name;
            return turnStr;
        });
        return cnCode;
    };

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
                search(content, '@', methodParamsInfo);
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
                search(content, '#', methodParamsInfo);
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

    const search = (val, type, methodParamsInfo) => {
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
    };

    const handleClick = (item, type) => {
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
    };

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
        </div>
    );
});

export default FormulaEdit;
