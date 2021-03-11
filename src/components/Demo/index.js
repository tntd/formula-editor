import React, { useEffect, useState, useRef } from "react";
import FormulaEdit from '../FormulaEdit';

export default props => {
    const defaultCode = "";
    const fieldList = [
        { name: "放款金额", value: "fkje" },
        { name: "实际放款金额", value: "sjfkje" },
        { name: "借款人姓名", value: "jkrxm" },
        { name: "借款人", value: "jkrsjh" },
        { name: "借款人身份证", value: "jkrsfz" }
    ];
    const methodList = [
        { name: "求和", value: "求和(,)", realValue: "sum" },
        { name: "平均值", value: "平均值(,)", realValue: "avg" },
        { name: "最大值", value: "最大值(,)", realValue: "max" },
        { name: "最小值", value: "最小值(,)", realValue: "min" },
    ];
    const normalList = [
        { name: "且", value: "and" },
        { name: "或", value: "or" }
    ];
    const getCode = (code, data) => {
        const { errorMsg, fieldList, methodList, normalList } = data;
        let keywords = [];
        fieldList.forEach(item => {
            const str = `@${item.name}`;
            keywords.push(str);
        });
        methodList.forEach(item => {
            const str = `#${item.name}`;
            keywords.push(str);
        });
        normalList.forEach(item => {
            keywords.push(item.name);
        });
        // 正则替换关键词
        let newCode = code.replace(
            new RegExp(`(${keywords.join("|")})`, "g"),
            function (match) {
                let turnStr = match;
                fieldList.forEach(item => {
                    const str = `@${item.name}`;
                    if (str === match) turnStr = `@${item.value}`;
                });
                methodList.forEach(item => {
                    const str = `#${item.name}`;
                    if (str === match) turnStr = `#${item.realValue}`;
                });
                normalList.forEach(item => {
                    if (match === item.name) turnStr = item.value;
                });
                return turnStr;
            }
        );
        console.log(newCode);
    }

    const formulaRef = useRef();

    return (
        <>
            <FormulaEdit
                ref={formulaRef}
                theme="night" // 主题
                height={300} // 高度
                defaultValue={defaultCode} // 初始化值
                fieldList={fieldList} // @唤起
                methodList={methodList} // #唤起
                normalList={normalList} // 自定义无需校验关键词
                readOnly={false} // 是否只读
                lineNumber={true} // 是否显示列数
                onChange={getCode} // 回调
            />
            <button onClick={() => {
                console.log(formulaRef);
                formulaRef.current.fullScreen();
            }}>全屏</button>
            <button onClick={() => {
                formulaRef.current.exitFullScreen();
            }}>退出全屏</button>
        </>
    );
};
