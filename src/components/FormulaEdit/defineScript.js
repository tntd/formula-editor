/*
 * @Author: liubo
 * @CreatDate: 2019-02-25 10:59:46
 * @Describe: 自定义codemirror mode
 */

import * as CodeMirror from "codemirror/lib/codemirror";

function defineScript(mode, modeField) {
	CodeMirror.defineMode(mode, function () {

		const markList = [">=", "<=", "!=", "=", ">", "<", "+", "-", "*", "/",
			"(", ")", ";", ",", ":", "{", "}"];

		// 括号栈，用于检查括号匹配
		let bracketStack = [];
		let lineErrors = new Map(); // 存储每行的错误信息

		return {
			startState: function() {
				return {
					bracketStack: [],
					lineNumber: 0,
					errors: []
				};
			},

			token: function (stream, state) {
				// 更新行号
				if (stream.sol()) {
					state.lineNumber++;
				}

				// 空白空间
				if (stream.eatSpace()) return null;

				// 处理单行注释
				if (stream.match("//")) {
					stream.skipToEnd(); // "//"后面全部包进comment
					return "comment";
				}

				// 处理括号匹配检查
				const char = stream.peek();
				if (char === '(' || char === '{' || char === '[') {
					stream.next();
					state.bracketStack.push({
						type: char,
						line: state.lineNumber,
						ch: stream.pos - 1
					});
					return "bracket";
				}

				if (char === ')' || char === '}' || char === ']') {
					stream.next();
					const expected = char === ')' ? '(' : char === '}' ? '{' : '[';
					const last = state.bracketStack.pop();
					
					if (!last || last.type !== expected) {
						// 括号不匹配错误
						return "bracket-error";
					}
					return "bracket";
				}

				// 处理其他符号
				for (let i = 0; i < markList.length; i++) {
					if (stream.match(markList[i])) {
						return "mark-keyword";
					}
				}

				// 处理布尔 true，false
				if (stream.match("true") || stream.match("false")) return "boolean-keyword";

				// 处理数字文本
				if (stream.match(/^[0-9\.+-]/, false)) {
					if (stream.match(/^[+-]?0x[0-9a-fA-F]+/)) { return "number"; }
					if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?/)) { return "number"; }
					if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?/)) { return "number"; }
				}

				// 处理string
				if (stream.match(/^"([^"]|(""))*"/)) { return "string"; }
				if (stream.match(/^'([^']|(''))*'/)) { return "string"; }

				const { 
					codemirrorFieldList = [], 
					codemirrorKeywordList = [], 
					codemirrorMethodList = [], 
					codemirrorNormalList = [] 
				} = modeField.current || {}

				// 处理@相关内容
				for (let i = 0; i < codemirrorFieldList.length; i++) {
					if (stream.match(codemirrorFieldList[i])) {
						return "field-keyword";
					}
				}

				// 处理关键字
				for (let i = 0; i < codemirrorKeywordList.length; i++) {
					if (stream.match(codemirrorKeywordList[i])) {
						return "keyword";
					}
				}

				// 处理#相关内容（函数）
				for (let i = 0; i < codemirrorMethodList.length; i++) {
					if (stream.match(codemirrorMethodList[i])) {
						// 简单的函数参数检查
						const nextChar = stream.peek();
						if (nextChar !== '(') {
							return "function-error"; // 函数缺少参数括号
						}
						return "function-keyword";
					}
				}

				// 处理自定义无需校验的关键词
				for (let i = 0; i < codemirrorNormalList.length; i++) {
					if (stream.match(codemirrorNormalList[i])) {
						return "function-keyword";
					}
				}	

				// 检查未闭合的字符串
				if (stream.match(/^"[^"]*$/) || stream.match(/^'[^']*$/)) {
					return "string-error";
				}

				// 处理未检测到的项目
				stream.next();
				return "nomal-keyword";
			},

			blankLine: function(state) {
				// 处理空行
				state.lineNumber++;
			}
		};
	});

	CodeMirror.defineMIME(`text/x-${mode}`, mode);
}

export default defineScript;