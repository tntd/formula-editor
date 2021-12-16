import React, { useEffect, useState, useRef } from "react";
import FormulaEdit from '../FormulaEdit';

const testData = [];
for (let i = 0; i < 8; i++) {
  testData.push(
    { name: `[字段]测试哈哈哈信贷测试${i}`, value: `hahahdsdhjbewdbu${i}` }
  );
}

const methodList = [
  { name: "求和", value: "求和(,)", realValue: "sum" },
  { name: "平均值", value: "平均值(,)", realValue: "avg" },
  { name: "最大值", value: "最大值(,)", realValue: "max" },
  { name: "最小值", value: "最小值(,)", realValue: "min" },
];
const methodList2 = [
  { name: "求和1", value: "求和1(,)", realValue: "sum" },
  { name: "平均值2", value: "平均值2(,)", realValue: "avg" },
  { name: "最大值3", value: "最大值3(,)", realValue: "max" },
  { name: "最小值4", value: "最小值4(,)", realValue: "min" },
];

const normalList = [
  { name: "且", value: "and" },
  { name: "或", value: "or" }
];

const fieldList = [
  { name: "放款金额", value: "fkje" },
  { name: "实际放款金额", value: "sjfkje" },
  { name: "借款人姓名", value: "jkrxm" },
  { name: "借款人", value: "jkrsjh" },
  { name: "借款人身份证", value: "jkrsfz" }
];

export default props => {
  const defaultCode = "hhahahah@111";
  const [code, setCode] = useState('@fkje@hahahdsdhjbewdbu1');
  const [height, setHeight] = useState(300);

  const [list, setList] = useState(testData);

  const [list1, setList1] = useState(methodList);

  const formulaRef = useRef();

  return (
    <>
      <FormulaEdit
        value={code} //传入组件自动转化成cnCode*/
        fieldList={list} // @唤起
        methodList={list1} // #唤起
        normalList={normalList} // 自定义无需校验关键词
        onChange={(enCode, data) => {
          console.log('onChange---------1')
          console.log(data)
          console.log('onChange---------2')
          setCode(enCode);
        }} // 回调

        editorEvent={(event) => {
          formulaRef.current = event;
        }}

        // defaultValue={defaultCode} // 初始化值 去除该属性
        // readOnly={false} // 是否只读 默认false
        // lineNumber={true} // 是否显示列数 默认true
        // theme="night" // 主题 默认night
        height={height} // 高度 默认300
      />
      <button onClick={() => {
        console.log(formulaRef);
        formulaRef.current.fullScreen();
      }}>全屏</button>
      <button onClick={() => {
        formulaRef.current.exitFullScreen();
      }}>退出全屏</button>
      <button onClick={() => {
        {/*setHeight(400);*/ }
        setList(fieldList);
      }}>test</button>
      <button onClick={() => {
        {/*setHeight(400);*/ }
        setList1(methodList2);
      }}>test2</button>
    </>
  );
};
