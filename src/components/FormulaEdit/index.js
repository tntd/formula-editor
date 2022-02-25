import React, { useEffect, useState, useRef, forwardRef } from "react";
import * as CodeMirror from "codemirror/lib/codemirror";

import "./defineScript";
import "codemirror/mode/groovy/groovy";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/3024-day.css";
import "codemirror/theme/material.css";

import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/display/fullscreen.js";

import "./index.less";

const beautify_js = require("js-beautify").js_beautify;

import ScrollContainer from './ScrollContainer';

const FormulaEdit = forwardRef((props, ref) => {
	const {
		children,
		value = "",
		readOnly = false,
		theme = "night",
		mode = "defineScript",
		selectStyle = {
			width: "200px"
		},
		lineNumber = true,
		indentUnit = 2,
		height = 300,
		fieldList = [],
		keyWords = ["int", "double", "string", "list", "boolean", "if", "else", "and", "or", "return"],
		methodList,
		normalList,
		editorEvent,
		...rest
	} = props;

	const [curState, setCurState] = useState({
		posLeft: 0,
		posTop: 0,
		tipShow: false,
		tipShowType: null,
		blurFlag: false
	});
	const [dropList, setDropList] = useState([]);
	const codeMirrorEditor = useRef();
	const textareaRef = useRef();
	const regExpRef = useRef('');

	const { posLeft, posTop, tipShowType, tipShow } = curState;

	// 全屏
	const fullScreen = () => {
		codeMirrorEditor.current.setOption("fullScreen", !codeMirrorEditor.current.getOption("fullScreen"));
		codeMirrorEditor.current.focus();
	}

	// 退出全屏
	const exitFullScreen = () => {
		if (codeMirrorEditor.current.getOption("fullScreen")) {
			codeMirrorEditor.current.setOption("fullScreen", false);
		}
	}

	useEffect(() => {
		setLocalStorage();

		let turnTheme;
		let ops = {}
		if (theme === "night") turnTheme = "material";
		if (theme === "day") turnTheme = "3024-day";
		if (mode === 'groovy') {
			ops = {
				mode: "text/x-groovy",
				indentUnit: indentUnit,
				extraKeys: {
					Tab: (cm) => {
						if (cm.somethingSelected()) { // 存在文本选择
							cm.indentSelection("add"); // 正向缩进文本
						} else { // 无文本选择
							// cm.indentLine(cm.getCursor().line, "add");  // 整行缩进 不符合预期
							cm.replaceSelection(Array(cm.getOption("indentUnit") + 1).join(" "), "end", "+input"); // 光标处插入 indentUnit 个空格
						}
					},
					"Shift-Tab": (cm) => { // 反向缩进
						if (cm.somethingSelected()) {
							cm.indentSelection("subtract"); // 反向缩进
						} else {
							// cm.indentLine(cm.getCursor().line, "subtract");  // 直接缩进整行
							const cursor = cm.getCursor();
							cm.setCursor({ line: cursor.line, ch: cursor.ch - cm.getOption("indentUnit") }); // 光标回退 indexUnit 字符
						}
						return;
					},
					"Ctrl-F": (cm) => {
						const formattValue = beautify_js(cm.getValue(), {
							indent_size: indentUnit,
							indent_char: indentUnit === "1" ? "\t" : " "
						});
						codeMirrorEditor.current.setValue(formattValue);
					}
				}
			}
		}

		if (!codeMirrorEditor.current) {
			codeMirrorEditor.current = CodeMirror.fromTextArea(textareaRef.current, {
				mode,
				theme: turnTheme,
				lineNumbers: lineNumber,
				lineWrapping: true,
				readOnly: readOnly ? "nocursor" : false,
				...ops,
				...rest
			});
		}

		let codeValue = '';
		if (value) codeValue = EnCodeToCn(value);
		codeMirrorEditor.current.setValue(codeValue);
		codeMirrorEditor.current.setSize("auto", height);

		document.body.addEventListener("click", listenner);

		editorEvent && editorEvent({ codeEditor: codeMirrorEditor.current, fullScreen, exitFullScreen })

		return () => {
			document.body.removeEventListener("click", listenner);
		}
	}, []);

	useEffect(() => {
		if (codeMirrorEditor.current) {
			codeMirrorEditor.current.addKeyMap({
				"Up": (cm) => {
					enterFuc("up", cm);
				},
				"Down": (cm) => {
					enterFuc("down", cm);
				},
				"Enter": (cm) => {
					enterFuc("enter", cm);
				},
				"Esc": () => {
					exitFullScreen();
				},
				"F9": () => {
					fullScreen();
				}
			});
		}
	}, [tipShow])

	useEffect(() => {
		if (!readOnly && codeMirrorEditor.current) {
			let codeValue = EnCodeToCn(value);
			insertValue(codeValue);
		}
	}, [readOnly, value]);

	useEffect(() => {
		if (codeMirrorEditor.current) {
			codeMirrorEditor.current.setSize("auto", height);
		}
	}, [height]);

	const editorChanges = (cm) => {
		if (props.onChange) {
			const errorkeyword = document.body.querySelector(".cm-nomal-keyword");
			let cnCode = cm.getValue();
			// 正则替换关键词
			let enCode = CnCodeToEn(cnCode);
			const data = {
				cnCode,
				enCode,
				errorMsg: errorkeyword ? "存在错误代码" : null
			};
			props.onChange(enCode, data);
		}
	}

	useEffect(() => {
		if (codeMirrorEditor.current && fieldList.length) {
			setLocalStorage();
			let codeValue = codeMirrorEditor.current.getValue() || value;
			if (codeValue) codeValue = EnCodeToCn(codeValue);
			codeMirrorEditor.current.setValue(codeValue);

			codeMirrorEditor.current.off("changes", editorChanges);
			codeMirrorEditor.current.on("changes", editorChanges);

			codeMirrorEditor.current.on("cursorActivity", (cm) => {
				cursorActivity(cm);
			});

			codeMirrorEditor.current.on("focus", (cm) => {
				cursorActivity(cm);
				setCurState({
					...curState,
					blurFlag: true
				});
			});
		}
	}, [fieldList, methodList, normalList]);

	const insertValue = (value) => {
		if (readOnly || !value) return;
		const getCursor = codeMirrorEditor.current.getCursor();
		const curLine = getCursor.ch;
		codeMirrorEditor.current.setCursor(getCursor.line, curLine);
		// codeMirrorEditor.current.focus();
	}

	const getLoacalList = (list, type) => {
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
		return JSON.stringify(codemirrorList);
	};

	const setLocalStorage = () => {
		// 字段存本地，供分词高亮使用
		localStorage.codemirrorFieldList = getLoacalList(fieldList, "@");
		localStorage.codemirrorMethodList = getLoacalList(methodList || [], "#");
		localStorage.codemirrorNormalList = getLoacalList(normalList || [], "");
		localStorage.codemirrorKeywordList = JSON.stringify(keyWords);
		const mArr = (methodList || []).map(item => `#${item.name}`);
		const nArr = (normalList || []).map(item => item.name);
		const keywords = [...mArr, ...nArr].join("|");
		regExpRef.current = new RegExp(`(${keywords})`, "g");
	};

	const CnCodeToEn = (cnCode) => {
		let enCode = cnCode.replace(
			/@[^\+\*\/#%\),;\-=@或且]*/g,
			(match) => {
				let turnStr = match.replace(/^\s*|\s*$/g, "");
				const fItem = fieldList.find(item => `@${item.name}` === turnStr);
				if (fItem) turnStr = `@${fItem.value}`;
				return turnStr;
			}
		);
		enCode = enCode.replace(
			regExpRef.current,
			(match) => {
				let turnStr = match;
				const mItem = (methodList || []).find(item => `#${item.name}` === match);
				if (mItem) turnStr = `#${mItem.realValue}`;
				const nItem = (normalList || []).find(item => item.name === match);
				if (nItem) turnStr = nItem.value;
				return turnStr;
			}
		);
		return enCode;
	};

	const EnCodeToCn = (enCode) => {
		const fValueArr = fieldList.map(item => `@${item.value}`);
		const mValueArr = (methodList || []).map(item => `#${item.realValue}`);
		const nValueArr = (normalList || []).map(item => item.value);
		const keywords = [...fValueArr, ...mValueArr, ...nValueArr].join("|");
		const regExp = new RegExp(`(${keywords})`, "g");
		let cnCode = enCode.replace(
			regExp,
			(match) => {
				let turnStr = match;
				const fItem = fieldList.find(item => `@${item.value}` === match);
				if (fItem) turnStr = `@${fItem.name}`;
				const mItem = (methodList || []).find(item => `#${item.realValue}` === match);
				if (mItem) turnStr = `#${mItem.name}`;
				const nItem = (normalList || []).find(item => item.value === match);
				if (nItem) turnStr = nItem.name;
				return turnStr;
			}
		);
		return cnCode;
	};

	const cursorActivity = (cm) => {
		if (readOnly) return;

		const getCursor = cm.getCursor();
		const pos = cm.cursorCoords(getCursor);
		const getLineInfo = cm.getLine(getCursor.line);
		const cursorBeforeOneChar = getLineInfo.substring(0, getCursor.ch);
		const lastIndex = cursorBeforeOneChar.lastIndexOf("@", getCursor.ch);
		const lastIndex2 = cursorBeforeOneChar.lastIndexOf("#", getCursor.ch);

		if (fieldList.length > 0 && lastIndex !== -1 && lastIndex > lastIndex2) { // 监测@
			const content = cursorBeforeOneChar.substring(lastIndex + 1, getCursor.ch);
			const findObj = fieldList.find(item => item.name.includes(content));
			if (findObj) {
				const temp = {
					...curState,
					posLeft: pos.left,
					posTop: pos.top + 20,
					tipShow: true,
					tipShowType: "@"
				}
				setCurState(temp);
				search(content, "@");
			} else {
				setCurState({
					...curState,
					tipShow: false,
					tipShowType: null
				});
			}
		}
		if (methodList && methodList.length > 0 && lastIndex2 !== -1 && lastIndex2 > lastIndex) { // 监测#
			const content = cursorBeforeOneChar.substring(lastIndex2 + 1, getCursor.ch);
			const findObj = methodList.find(item => item.name.includes(content));
			if (findObj) {
				setCurState({
					...curState,
					posLeft: pos.left,
					posTop: pos.top + 20,
					tipShow: true,
					tipShowType: "#"
				});
				search(content, "#");
			} else {
				setCurState({
					...curState,
					tipShow: false,
					tipShowType: null
				});
			}
		}
		if (!cursorBeforeOneChar.includes("@") && !cursorBeforeOneChar.includes("#")) {
			setCurState({
				...curState,
				tipShow: false,
				tipShowType: null
			});
		}
	}

	const search = (val, type) => {
		let list = [];
		const searchList = type === "@" ? fieldList : (methodList || []);
		searchList.forEach((item) => {
			if (item.name.includes(val)) {
				list.push(item);
			}
		});
		setDropList(list);
	};

	const handleClick = (item, type) => {
		const getCursor = codeMirrorEditor.current.getCursor();
		const getLineInfo = codeMirrorEditor.current.getLine(getCursor.line);
		const cursorBeforeOneChar = getLineInfo.substring(0, getCursor.ch);
		const lastIndex = cursorBeforeOneChar.lastIndexOf(type, getCursor.ch);
		codeMirrorEditor.current.setSelection(
			{ line: getCursor.line, ch: lastIndex + 1 },
			{ line: getCursor.line, ch: getCursor.ch },
		);
		let content = type === "@" ? item.name : item.value;
		codeMirrorEditor.current.replaceSelection(content);
		codeMirrorEditor.current.setCursor(getCursor.line, lastIndex + 1 + content.length);
		codeMirrorEditor.current.focus();
		setCurState({
			...curState,
			tipShow: false,
			tipShowType: null
		});
	}

	const enterFuc = (type, cm) => {
		if (!tipShow) {
			if (type === "up") {
				cm.execCommand("goLineUp");
			} else if (type === "down") {
				cm.execCommand("goLineDown");
			} else if (type === "enter") {
				cm.execCommand("newlineAndIndent");
			};
			return false;
		}
		let findLi = "cm-field-li";
		let active = "cm-active";
		const nodeList = document.querySelector('.box-ul').querySelectorAll(`.${findLi}`);
		const length = nodeList.length;
		let index = 0;
		let hasActive = false;
		for (let i = 0; i < length; i++) {
			if (nodeList[i].className.includes(active)) {
				index = i;
				hasActive = true;
			}
		}
		if (type === "up") {
			nodeList[index].className = findLi;
			if (index === 0) {
				nodeList[0].className = `${active} ${findLi}`;
			} else {
				nodeList[index - 1].className = `${active} ${findLi}`;
			}
			document.querySelector('.box-ul').querySelector(`.${active}`).scrollIntoViewIfNeeded();
		} else if (type === "down") {
			nodeList[index].setAttribute('class', findLi);
			if (index === length - 1) {
				nodeList[index].setAttribute('class', `${active} ${findLi}`)
			} else {
				nodeList[index + 1].setAttribute('class', `${active} ${findLi}`)
			}
			document.querySelector('.box-ul').querySelector(`.${active}`).scrollIntoViewIfNeeded();
		} else if (type === "enter") {
			const node = document.querySelector(`.${active}`);
			handleClick({
				name: node.innerText,
				value: node.attributes.data.value
			}, tipShowType);
			setTimeout(() => {
				setCurState({
					...curState,
					tipShow: false,
					tipShowType: null
				});
			}, 100);
		};
	};

	const listenner = (e) => {
		const targetClassName = e.target.className;
		if (typeof (targetClassName) !== "string") return;
		const list = [
			"codemirror-tip-day",
			"codemirror-tip-night"
		];
		const returnFalse = list.find(item => targetClassName.includes(item));
		if (returnFalse) return false;
		const targetPath = e.path;
		let flag = false;
		targetPath && targetPath.forEach(item => {
			if (item.className) {
				if (typeof (item.className) !== "string") return;
				if (item.className.includes("CodeMirror-line") ||
					item.className.includes("CodeMirror-linenumber")
				) {
					flag = true;
				}
			}
		});
		if (flag) {
			setCurState({
				...curState,
				blurFlag: true
			});
		} else {
			setCurState({
				...curState,
				blurFlag: false,
				tipShow: false
			});
		}
		if (targetClassName === "CodeMirror-scroll") {
			setCurState({
				...curState,
				blurFlag: true
			});
		}
	}

	return (
		<div className="m-codemirror">
			{children}
			<textarea ref={textareaRef} />
			{/* @弹框 */}
			{tipShow ? (
				<ScrollContainer
					theme={theme} //主题样式
					dropList={dropList} //加载的数据
					listLen={dropList.length} //加载的数据长度
					listSize={20} //下拉列表一次显示多少条 默认20
					itemHeight={30} //下拉列表单项高度 默认30
					selectChange={(item) => {
						handleClick(item, tipShowType);
					}}
					style={{
						left: `${posLeft}px`,
						top: `${posTop}px`,
						...selectStyle
					}}
				/>
			) : ''}
		</div>
	);

})

export default FormulaEdit;

