module.exports=function(e){var r={};function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:n})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,r){if(1&r&&(e=t(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(t.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)t.d(n,o,function(r){return e[r]}.bind(null,o));return n},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},t.p="",t(t.s=16)}([function(e,r){e.exports=require("react")},function(e,r){e.exports=require("codemirror/lib/codemirror")},function(e,r,t){var n=t(10);"string"==typeof n&&(n=[[e.i,n,""]]);var o={hmr:!0,transform:void 0};t(12)(n,o);n.locals&&(e.exports=n.locals)},function(e,r){e.exports=require("codemirror/mode/groovy/groovy")},function(e,r){e.exports=require("codemirror/mode/sql/sql")},function(e,r){e.exports=require("codemirror/lib/codemirror.css")},function(e,r){e.exports=require("codemirror/theme/3024-day.css")},function(e,r){e.exports=require("codemirror/theme/material.css")},function(e,r){e.exports=require("codemirror/addon/display/fullscreen.css")},function(e,r){e.exports=require("codemirror/addon/display/fullscreen.js")},function(e,r,t){(e.exports=t(11)(!1)).push([e.i,".m-codemirror {\n  position: relative;\n  overflow: hidden;\n  border: #d7d7d7 solid 1px;\n}\n.m-codemirror .placeholder {\n  position: absolute;\n  top: 3px;\n  left: 35px;\n  font-size: 12px;\n  color: #c6d0d3;\n  opacity: 0.4;\n}\n.m-codemirror .codemirror-tip-day,\n.m-codemirror .codemirror-tip-night {\n  position: fixed;\n  left: 0;\n  top: 0;\n  z-index: 999;\n  background: #fff;\n  width: 200px;\n  height: 200px;\n  overflow: auto;\n  box-shadow: rgba(119, 119, 119, 0.2) 0px 0px 7px, rgba(0, 0, 0, 0) 1px 1px 0px inset, rgba(0, 0, 0, 0) -1px -1px 0px inset;\n  font-size: 12px;\n}\n.m-codemirror .codemirror-tip-day ul,\n.m-codemirror .codemirror-tip-night ul {\n  margin: 0;\n  padding: 0;\n  overflow: auto;\n}\n.m-codemirror .codemirror-tip-day ul li,\n.m-codemirror .codemirror-tip-night ul li {\n  list-style: none;\n  cursor: pointer;\n  padding: 0px 10px;\n  height: 30px;\n  line-height: 30px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.m-codemirror .codemirror-tip-day ul li sup,\n.m-codemirror .codemirror-tip-night ul li sup {\n  padding-right: 5px;\n}\n.m-codemirror .codemirror-tip-day ul li:hover,\n.m-codemirror .codemirror-tip-night ul li:hover {\n  background: #63acff;\n  color: #fff;\n}\n.m-codemirror .codemirror-tip-day ul .cm-active,\n.m-codemirror .codemirror-tip-night ul .cm-active {\n  background: #63acff;\n  color: #fff;\n}\n.m-codemirror .cm-s-3024-day span.cm-field-keyword {\n  color: #FF9800;\n}\n.m-codemirror .cm-s-3024-day span.cm-function-keyword {\n  color: #03A9F4;\n}\n.m-codemirror .cm-s-3024-day span.cm-nomal-keyword {\n  color: #F44336;\n  border-bottom: #F44336 1px dotted;\n}\n.m-codemirror .cm-s-3024-day span.cm-boolean-keyword {\n  color: #673AB7;\n}\n.m-codemirror .cm-s-3024-day span.cm-string {\n  color: #cdab53;\n}\n.m-codemirror .cm-s-3024-day span.cm-comment {\n  color: #9E9E9E;\n}\n.m-codemirror .cm-s-material span.cm-field-keyword {\n  color: #FF9800;\n}\n.m-codemirror .cm-s-material span.cm-function-keyword {\n  color: #03A9F4;\n}\n.m-codemirror .cm-s-material span.cm-nomal-keyword {\n  color: #F44336;\n  border-bottom: #F44336 1px dotted;\n}\n.m-codemirror .cm-s-material span.cm-boolean-keyword {\n  color: #7689f3;\n}\n",""])},function(e,r){e.exports=function(e){var r=[];return r.toString=function(){return this.map(function(r){var t=function(e,r){var t=e[1]||"",n=e[3];if(!n)return t;if(r&&"function"==typeof btoa){var o=(c=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(c))))+" */"),i=n.sources.map(function(e){return"/*# sourceURL="+n.sourceRoot+e+" */"});return[t].concat(i).concat([o]).join("\n")}var c;return[t].join("\n")}(r,e);return r[2]?"@media "+r[2]+"{"+t+"}":t}).join("")},r.i=function(e,t){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(n[i]=!0)}for(o=0;o<e.length;o++){var c=e[o];"number"==typeof c[0]&&n[c[0]]||(t&&!c[2]?c[2]=t:t&&(c[2]="("+c[2]+") and ("+t+")"),r.push(c))}},r}},function(e,r,t){var n,o,i={},c=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===o&&(o=n.apply(this,arguments)),o}),a=function(e){var r={};return function(e){if(void 0===r[e]){var t=function(e){return document.querySelector(e)}.call(this,e);if(t instanceof window.HTMLIFrameElement)try{t=t.contentDocument.head}catch(e){t=null}r[e]=t}return r[e]}}(),l=null,u=0,s=[],f=t(13);function d(e,r){for(var t=0;t<e.length;t++){var n=e[t],o=i[n.id];if(o){o.refs++;for(var c=0;c<o.parts.length;c++)o.parts[c](n.parts[c]);for(;c<n.parts.length;c++)o.parts.push(g(n.parts[c],r))}else{var a=[];for(c=0;c<n.parts.length;c++)a.push(g(n.parts[c],r));i[n.id]={id:n.id,refs:1,parts:a}}}}function p(e,r){for(var t=[],n={},o=0;o<e.length;o++){var i=e[o],c=r.base?i[0]+r.base:i[0],a={css:i[1],media:i[2],sourceMap:i[3]};n[c]?n[c].parts.push(a):t.push(n[c]={id:c,parts:[a]})}return t}function m(e,r){var t=a(e.insertInto);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=s[s.length-1];if("top"===e.insertAt)n?n.nextSibling?t.insertBefore(r,n.nextSibling):t.appendChild(r):t.insertBefore(r,t.firstChild),s.push(r);else if("bottom"===e.insertAt)t.appendChild(r);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var o=a(e.insertInto+" "+e.insertAt.before);t.insertBefore(r,o)}}function h(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var r=s.indexOf(e);r>=0&&s.splice(r,1)}function v(e){var r=document.createElement("style");return e.attrs.type="text/css",y(r,e.attrs),m(e,r),r}function y(e,r){Object.keys(r).forEach(function(t){e.setAttribute(t,r[t])})}function g(e,r){var t,n,o,i;if(r.transform&&e.css){if(!(i=r.transform(e.css)))return function(){};e.css=i}if(r.singleton){var c=u++;t=l||(l=v(r)),n=S.bind(null,t,c,!1),o=S.bind(null,t,c,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(t=function(e){var r=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",y(r,e.attrs),m(e,r),r}(r),n=function(e,r,t){var n=t.css,o=t.sourceMap,i=void 0===r.convertToAbsoluteUrls&&o;(r.convertToAbsoluteUrls||i)&&(n=f(n));o&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(o))))+" */");var c=new Blob([n],{type:"text/css"}),a=e.href;e.href=URL.createObjectURL(c),a&&URL.revokeObjectURL(a)}.bind(null,t,r),o=function(){h(t),t.href&&URL.revokeObjectURL(t.href)}):(t=v(r),n=function(e,r){var t=r.css,n=r.media;n&&e.setAttribute("media",n);if(e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}.bind(null,t),o=function(){h(t)});return n(e),function(r){if(r){if(r.css===e.css&&r.media===e.media&&r.sourceMap===e.sourceMap)return;n(e=r)}else o()}}e.exports=function(e,r){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(r=r||{}).attrs="object"==typeof r.attrs?r.attrs:{},r.singleton||"boolean"==typeof r.singleton||(r.singleton=c()),r.insertInto||(r.insertInto="head"),r.insertAt||(r.insertAt="bottom");var t=p(e,r);return d(t,r),function(e){for(var n=[],o=0;o<t.length;o++){var c=t[o];(a=i[c.id]).refs--,n.push(a)}e&&d(p(e,r),r);for(o=0;o<n.length;o++){var a;if(0===(a=n[o]).refs){for(var l=0;l<a.parts.length;l++)a.parts[l]();delete i[a.id]}}}};var b,w=(b=[],function(e,r){return b[e]=r,b.filter(Boolean).join("\n")});function S(e,r,t,n){var o=t?"":n.css;if(e.styleSheet)e.styleSheet.cssText=w(r,o);else{var i=document.createTextNode(o),c=e.childNodes;c[r]&&e.removeChild(c[r]),c.length?e.insertBefore(i,c[r]):e.appendChild(i)}}},function(e,r){e.exports=function(e){var r="undefined"!=typeof window&&window.location;if(!r)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var t=r.protocol+"//"+r.host,n=t+r.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,r){var o,i=r.trim().replace(/^"(.*)"$/,function(e,r){return r}).replace(/^'(.*)'$/,function(e,r){return r});return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(i)?e:(o=0===i.indexOf("//")?i:0===i.indexOf("/")?t+i:n+i.replace(/^\.\//,""),"url("+JSON.stringify(o)+")")})}},function(e,r){e.exports=require("js-beautify")},function(e,r){e.exports=require("intersection-observer")},function(e,r,t){"use strict";t.r(r);var n,o=t(0),i=t.n(o),c=t(1);(n=c).defineMode("defineScript",function(){var e=[">=","<=","!=","=",">","<","+","-","*","/","(",")",";",",",":","{","}"];return{token:function(r){if(r.eatSpace())return null;if(r.match("//"))return r.skipToEnd(),"comment";for(var t=0;t<e.length;t++)if(r.match(e[t]))return"mark-keyword";if(r.match("true")||r.match("false"))return"boolean-keyword";if(r.match(/^[0-9\.+-]/,!1)){if(r.match(/^[+-]?0x[0-9a-fA-F]+/))return"number";if(r.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?/))return"number";if(r.match(/^[+-]?\d+([EeDd][+-]?\d+)?/))return"number"}if(r.match(/^"([^"]|(""))*"/))return"string";if(r.match(/^'([^']|(''))*'/))return"string";for(var n=localStorage.codemirrorFieldList?JSON.parse(localStorage.codemirrorFieldList):[],o=0;o<n.length;o++)if(r.match(n[o]))return"field-keyword";for(var i=localStorage.codemirrorKeywordList?JSON.parse(localStorage.codemirrorKeywordList):[],c=0;c<i.length;c++)if(r.match(i[c]))return"keyword";for(var a=localStorage.codemirrorMethodList?JSON.parse(localStorage.codemirrorMethodList):[],l=0;l<a.length;l++)if(r.match(a[l]))return"function-keyword";for(var u=localStorage.codemirrorNormalList?JSON.parse(localStorage.codemirrorNormalList):[],s=0;s<u.length;s++)if(r.match(u[s]))return"function-keyword";return r.next(),"nomal-keyword"}}}),n.defineMIME("text/x-defineScript","defineScript");t(3),t(4),t(5),t(6),t(7),t(8),t(9),t(2),t(15);function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.forEach(function(r){l(e,r,t[r])})}return e}function l(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}var u={INT:{displayName:"整数",color:"#5262C7"},DOUBLE:{displayName:"小数",color:"#00D2C2"},STRING:{displayName:"字符",color:"#826AF9"},ENUM:{displayName:"枚举",color:"#00C5DC"},BOOLEAN:{displayName:"布尔",color:"#4A9AF7"},DATETIME:{displayName:"时间",color:"#826AF9"},ARRAY:{displayName:"数组",color:"#E5A74F"}},s=function(e){var r=e.style,t=e.dropList,n=e.theme,c=e.selectChange,l=e.listLen,s=e.listSize,f=e.itemHeight,d=e.typeMap,p=Math.floor(s/2),m=null,h=0,v=0,y=null,g=null,b=0;Object(o.useEffect)(function(){if(window.currentIndex=v,l<=s){O(0,l);var e=document.querySelector(".box-ul");l&&e&&e.children&&e.children[0].classList.add("cm-active")}else m=new IntersectionObserver(function(e){var r=!0,t=!1,n=void 0;try{for(var o,i=e[Symbol.iterator]();!(r=(o=i.next()).done);r=!0){var c=o.value;if(!c.isIntersecting)return!1;v&&c.target.classList.contains("li-first")?L(!1):c.target.classList.contains("li-last")&&L(!0)}}catch(e){t=!0,n=e}finally{try{r||null==i.return||i.return()}finally{if(t)throw n}}}),x(),S();return function(){y&&m&&m.unobserve(y),g&&m&&m.unobserve(g),m&&m.disconnect(),w()}},[t]),Object(o.useEffect)(function(){var e=document.querySelector(".box-ul");return e.addEventListener("click",function(e){var r=e.target.getAttribute("data-value"),t=e.target.getAttribute("data-name");c({name:t,value:r})}),function(){e.removeEventListener("click",function(){})}},[]);var w=function(){var e=document.querySelector(".box-ul");e.style.paddingTop="0px",e.style.paddingBottom="0px",m=null,h=0,v=0,b=0,y=null,g=null,document.querySelector(".scroll-container").scrollTop=0},S=function(){var e=document.querySelector(".scroll-container"),r=e&&e.offsetHeight,t=f*p-f-r;e.onscroll=function(e){var r=e.target.scrollTop;if(r-b>=f){var n=Math.floor(Math.abs(r-t)/(f*p))*p,o=N();(n=n>o?o:n)!==window.currentIndex&&A(n,!0),b=r}if(r-b<=-f){var i=Math.floor((r-f)/(f*p))*p;A(i=i<=0?0:i,!1),b=r}}},x=function(){O(0,s),T(0),setTimeout(function(){j()},100)},O=function(e,r){var n=a({},u,d),o=JSON.parse(JSON.stringify(t));o=o.splice(e,r);for(var i=document.querySelector(".box-ul"),c="",l=0;l<o.length;l++){var s=o[l],f=n[s.type]?n[s.type]:"";c+="<li key=".concat(l,' class="cm-field-li" data-value="').concat(s.value,'" title="').concat(s.name,'" data="').concat(s.value,'" data-name="').concat(s.name,'">').concat(f?'<sup style="color: '.concat(f.color,'"> ').concat(f.displayName,"</sup>"):"").concat(s.name,"</li>")}i.innerHTML="",i.innerHTML=c},j=function(e){var r=document.querySelector(".box-ul");if(y&&m&&m.unobserve(y),g&&m&&m.unobserve(g),r&&r.children&&r.children.length){r.children[0].classList.add("li-first");var t=0;e&&window.currentIndex&&(t=window.currentIndex/10%2>0?8:7),!1===e&&(t=window.currentIndex/10%2>0?13:11),r&&r.children&&r.children[t]&&r.children[t].classList.add("cm-active"),r.children[r.children.length-1].classList.add("li-last");var n=r.querySelector(".".concat("li-first")),o=r.querySelector(".".concat("li-last"));m&&m.observe(n),m&&m.observe(o),y=n,g=o}},L=function(e){var r=E(e);A(r,e)},E=function(e){return e?v+p:v-p<0?0:v-p},N=function(){var e,r=l%s;return(e=0===r?l-s:r>=p?l-r:l-r-p)<=0?0:e},A=function(e,r){var t=N();if(r){if(e>t)return}else if(h===e)return;h=e,e===t?O(t,l-t):O(e,s),v=e,window.currentIndex=v,j(r),T(e)},T=function(e){var r=document.querySelector(".box-ul"),t=p*f,n=(l-s)/p*t,o=e<=0?0:e/p*t,i=n-o<0?0:n-o;r.style.paddingTop="".concat(o,"px"),r.style.paddingBottom="".concat(i,"px")};return i.a.createElement("div",{className:"codemirror-tip-".concat(n," scroll-container"),style:a({},r),id:"scrollDiv"},i.a.createElement("ul",{className:"cm-field-ul box-ul",ref:function(e){return e}}))};function f(e){return function(e){if(Array.isArray(e)){for(var r=0,t=new Array(e.length);r<e.length;r++)t[r]=e[r];return t}}(e)||function(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function d(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{},n=Object.keys(t);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.forEach(function(r){p(e,r,t[r])})}return e}function p(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function m(e,r){return function(e){if(Array.isArray(e))return e}(e)||function(e,r){var t=[],n=!0,o=!1,i=void 0;try{for(var c,a=e[Symbol.iterator]();!(n=(c=a.next()).done)&&(t.push(c.value),!r||t.length!==r);n=!0);}catch(e){o=!0,i=e}finally{try{n||null==a.return||a.return()}finally{if(o)throw i}}return t}(e,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function h(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var v=t(14).js_beautify,y=Object(o.forwardRef)(function(e,r){var t=e.children,n=e.value,a=void 0===n?"":n,l=e.readOnly,u=void 0!==l&&l,p=e.theme,y=void 0===p?"night":p,g=e.mode,b=void 0===g?"defineScript":g,w=e.selectStyle,S=void 0===w?{width:"200px"}:w,x=e.lineNumber,O=void 0===x||x,j=e.indentUnit,L=void 0===j?2:j,E=e.regExp,N=void 0===E?"":E,A=e.isEndMark,T=e.height,k=void 0===T?300:T,C=e.fieldList,M=e.typeMap,q=void 0===M?{}:M,I=e.keyWords,U=void 0===I?["int","double","string","list","boolean","if","else","and","or","return"]:I,R=e.methodList,F=e.normalList,P=e.editorEvent,B=e.placeholder,D=h(e,["children","value","readOnly","theme","mode","selectStyle","lineNumber","indentUnit","regExp","isEndMark","height","fieldList","typeMap","keyWords","methodList","normalList","editorEvent","placeholder"]),J=m(Object(o.useState)({posLeft:0,posTop:0,tipShow:!1,tipShowType:null}),2),V=J[0],_=J[1],z=m(Object(o.useState)([]),2),H=z[0],K=z[1],$=m(Object(o.useState)("@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@]*"),2),G=$[0],W=$[1],Y=Object(o.useRef)(),Q=Object(o.useRef)(),X=Object(o.useRef)(""),Z=V.posLeft,ee=V.posTop,re=V.tipShowType,te=V.tipShow,ne=function(){Y.current.setOption("fullScreen",!Y.current.getOption("fullScreen")),Y.current.focus()},oe=function(){Y.current.getOption("fullScreen")&&Y.current.setOption("fullScreen",!1)};Object(o.useEffect)(function(){var e;ue();var r={};"night"===y&&(e="material"),"day"===y&&(e="3024-day"),"groovy"===b&&(r={mode:"text/x-groovy",indentUnit:L,extraKeys:{Tab:function(e){e.somethingSelected()?e.indentSelection("add"):e.replaceSelection(Array(e.getOption("indentUnit")+1).join(" "),"end","+input")},"Shift-Tab":function(e){if(e.somethingSelected())e.indentSelection("subtract");else{var r=e.getCursor();e.setCursor({line:r.line,ch:r.ch-e.getOption("indentUnit")})}},"Ctrl-F":function(e){var r=v(e.getValue(),{indent_size:L,indent_char:"1"===L?"\t":" "});Y.current.setValue(r)}}}),Y.current||(Y.current=c.fromTextArea(Q.current,d({mode:b,theme:e,lineNumbers:O,lineWrapping:!0,readOnly:!!u&&"nocursor"},r,D)));var t="";return a&&(t=fe(a)),Y.current.setValue(t),Y.current.setSize("auto",k),"groovy"===b&&(Y.current.off("changes",ce),Y.current.on("changes",ce)),P&&P({codeEditor:Y.current,fullScreen:ne,exitFullScreen:oe}),function(){}},[]),Object(o.useEffect)(function(){Y.current&&Y.current.addKeyMap({Up:function(e){he("up",e)},Down:function(e){he("down",e)},Enter:function(e){he("enter",e)},Esc:function(){oe()},F9:function(){ne()}})},[te]),Object(o.useEffect)(function(){if(!u&&Y.current){var e=fe(a);ae(e)}},[u,a]),Object(o.useEffect)(function(){Y.current&&Y.current.setSize("auto",k)},[k]);var ie=function(r){var t=document.body.querySelector(".cm-nomal-keyword"),n=se(r),o={cnCode:r,enCode:n,errorMsg:t?"存在错误代码":null};e.onChange(n,o)},ce=function(r){if(e.onChange){var t=r.getValue();ie(t)}};Object(o.useEffect)(function(){if(Y.current&&"groovy"!==b){ue();var e=a;e&&(e=fe(e)),Y.current.setValue(e),Y.current.off("changes",ce),Y.current.on("changes",ce),Y.current.on("cursorActivity",function(e){de(e)}),Y.current.on("focus",function(e){de(e),_(d({},V))})}if(!N&&(F||[]).length){var r=F.map(function(e){return e.name});r=r.join(""),W("@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@".concat(r,"]*"))}if((C||[]).length||(R||[]).length||(F||[]).length){var t=fe(a);ie(t)}},[C,R,F]);var ae=function(e){if(!u&&e){var r=Y.current.getCursor(),t=r.ch;Y.current.setCursor(r.line,t)}},le=function(e,r){var t=Object.assign([],e);t.sort(function(e,r){return e.name.length>r.name.length?-1:e.name.length<r.name.length?1:0});for(var n=[],o=0;o<t.length;o++)n.push("".concat(r).concat(t[o].name));return JSON.stringify(n)},ue=function(){localStorage.codemirrorFieldList=le(C||[],"@"),localStorage.codemirrorMethodList=le(R||[],"#"),localStorage.codemirrorNormalList=le(F||[],""),localStorage.codemirrorKeywordList=JSON.stringify(U);var e=(R||[]).map(function(e){return"#".concat(e.name)}),r=(F||[]).map(function(e){return e.name}),t=[].concat(f(e),f(r)).join("|");X.current=new RegExp("(".concat(t,")"),"g")},se=function(e){var r=new RegExp(N||G,"g"),t=e.replace(r,function(e){var r=e.replace(/^\s*|\s*$/g,""),t=(C||[]).find(function(e){return"@".concat(e.name)===r});return t&&(r="@".concat(t.value)),r});return t=t.replace(X.current,function(e){var r=e,t=(R||[]).find(function(r){return"#".concat(r.name)===e});t&&(r="#".concat(t.realValue));var n=(F||[]).find(function(r){return r.name===e});return n&&(r=n.value),r})},fe=function(e){var r=new RegExp(i||G,"g"),t=(R||[]).map(function(e){return"#".concat(e.realValue)}),n=(F||[]).map(function(e){return e.value}),o=[].concat(f(t),f(n)).join("|"),i=new RegExp("(".concat(o,")"),"g"),c=e.replace(r,function(e){var r=e,t=(C||[]).find(function(r){return"@".concat(r.value)===e});return t&&(r="@".concat(t.name)),r});return c=c.replace(i,function(e){var r=e,t=(R||[]).find(function(r){return"#".concat(r.realValue)===e});t&&(r="#".concat(t.name));var n=(F||[]).find(function(r){return r.value===e});return n&&(r=n.name),r})},de=function(e){if(!u){var r=e.getCursor(),t=e.cursorCoords(r),n=e.getLine(r.line).substring(0,r.ch),o=n.lastIndexOf("@",r.ch),i=n.lastIndexOf("#",r.ch);if(C&&C.length>0&&-1!==o&&o>i){var c=n.substring(o+1,r.ch);if(C.find(function(e){return e.name.includes(c)})){var a=d({},V,{posLeft:t.left,posTop:t.top+20,tipShow:!0,tipShowType:"@"});_(a),pe(c,"@")}else _(d({},V,{tipShow:!1,tipShowType:null}))}if(R&&R.length>0&&-1!==i&&i>o){var l=n.substring(i+1,r.ch);R.find(function(e){return e.name.includes(l)})?(_(d({},V,{posLeft:t.left,posTop:t.top+20,tipShow:!0,tipShowType:"#"})),pe(l,"#")):_(d({},V,{tipShow:!1,tipShowType:null}))}n.includes("@")||n.includes("#")||_(d({},V,{tipShow:!1,tipShowType:null}))}},pe=function(e,r){var t=[];("@"===r?C||[]:R||[]).forEach(function(r){r.name.includes(e)&&t.push(r)}),K(t)},me=function(e,r){var t=Y.current.getCursor(),n=Y.current.getLine(t.line).substring(0,t.ch).lastIndexOf(r,t.ch);Y.current.setSelection({line:t.line,ch:n+1},{line:t.line,ch:t.ch});var o="@"===r?e.name+(A?"@":""):e.value;Y.current.replaceSelection(o),Y.current.setCursor(t.line,n+1+o.length),Y.current.focus(),_(d({},V,{tipShow:!1,tipShowType:null}))},he=function(e,r){if(!te)return"up"===e?r.execCommand("goLineUp"):"down"===e?r.execCommand("goLineDown"):"enter"===e&&r.execCommand("newlineAndIndent"),!1;for(var t="cm-field-li",n="cm-active",o=document.querySelector(".box-ul").querySelectorAll(".".concat(t)),i=o.length,c=0,a=0;a<i;a++)o[a].className.includes(n)&&(c=a,!0);if("up"===e)o[c].className=t,0===c?o[0].className="".concat(n," ").concat(t):o[c-1].className="".concat(n," ").concat(t),document.querySelector(".box-ul").querySelector(".".concat(n)).scrollIntoViewIfNeeded();else if("down"===e)o[c].setAttribute("class",t),c===i-1?o[c].setAttribute("class","".concat(n," ").concat(t)):o[c+1].setAttribute("class","".concat(n," ").concat(t)),document.querySelector(".box-ul").querySelector(".".concat(n)).scrollIntoViewIfNeeded();else if("enter"===e){var l=document.querySelector(".".concat(n));me({name:l.title,value:l.attributes.data.value},re),setTimeout(function(){_(d({},V,{tipShow:!1,tipShowType:null}))},100)}};return i.a.createElement("div",{className:"m-codemirror"},t,i.a.createElement("textarea",{ref:Q}),B&&!a&&i.a.createElement("a",{className:"placeholder"},B),te?i.a.createElement(s,{theme:y,dropList:H,listLen:H.length,listSize:20,itemHeight:30,typeMap:q,selectChange:function(e){me(e,re)},style:d({left:"".concat(Z,"px"),top:"".concat(ee,"px")},S)}):"")});r.default=y}]);