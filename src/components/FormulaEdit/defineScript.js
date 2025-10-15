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

		return {
			startState: function() {
                return { inMultilineComment: false };
            },
			token: function (stream, state) {
				// 空白空间
				if (stream.eatSpace()) return null;

				if (state.inMultilineComment) {
					// 跳过内容直到找到'*'字符
					const beforeLength = stream.pos;
					stream.skipTo("*");
					
					// 如果找到'*'，消耗它
					if (stream.pos !== beforeLength) {
					stream.next(); // 消耗 '*'
					
					// 检查下一个字符是否是'/'，如果是则结束注释
					if (stream.peek() === "/") {
						stream.next(); // 消耗 '/'
						state.inMultilineComment = false;
					}
					} else {
					// 到达行尾，继续保持在多行注释状态
					stream.skipToEnd();
					}
					return "comment";
				}

				// 处理单行注释
				if (stream.match("//")) {
					stream.skipToEnd(); // "//"后面全部包进comment
					return "comment";
				}

				// 处理多行注释 /* */
                if (stream.match("/**")) {
					state.inMultilineComment = true;
					
					// 立即检查是否有单行的多行注释（如 /* 注释 */）
					const beforeLength = stream.pos;
					stream.skipTo("*");
					
					if (stream.pos !== beforeLength) {
					stream.next(); // 消耗 '*'
					if (stream.peek() === "/") {
						stream.next(); // 消耗 '/'
						state.inMultilineComment = false;
					}
					} else {
					stream.skipToEnd();
					}
					return "comment";
				}
				
				// 处理符号
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
				// 处理@相关内容
				for (let i = 0; i < codemirrorKeywordList.length; i++) {
					if (stream.match(codemirrorKeywordList[i])) {
						return "keyword";
					}
				}
				// if (fieldKeywordArray.length > 0 && stream.match("@")) { return "field-keyword"; }

				// 处理#相关内容
				for (let i = 0; i < codemirrorMethodList.length; i++) {
					if (stream.match(codemirrorMethodList[i])) {
						return "function-keyword";
					}
				}
				// if (keywordFunctionArray.length > 0 && stream.match("#")) { return "function-keyword"; }

				// 处理自定义无需校验的关键词
				for (let i = 0; i < codemirrorNormalList.length; i++) {
					if (stream.match(codemirrorNormalList[i])) {
						return "function-keyword";
					}
				}	

				// 处理未检测到的项目
				stream.next();
				return "nomal-keyword";
			}
		};
	});

	CodeMirror.defineMIME(`text/x-${mode}`, mode);
}

export default defineScript;
