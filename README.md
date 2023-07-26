# @tntd/formula-edit

react计算公式编辑器

## Usage

### @tntd/formula-edit

安装

```sh
npm install --save-dev @tntd/formula-edit
```
使用

```
<FormulaEdit
    value='@hahahdsdhjbewdbu1#avg(,)andhhhhhhh' //传入组件自动转化成cnCode
    fieldList={testData} // @唤起
    regRxp="@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@]*" //中文转英文默认正则
    typeMap={{'OBJECT':{'displayName':'对象','color': 'blue'}}} // 下拉框 自定义展示类型和颜色
    methodList={methodList} // #唤起
    normalList={normalList} // 自定义无需校验关键词
    onChange={(enCode,data)=>{}} // 回调
    // defaultValue={defaultCode} // 初始化值 已去除该属性
    // readOnly={false} // 是否只读 默认false
    // lineNumber={true} // 是否显示列数 默认true
    // theme="night" // 主题 默认night
    // height={300} // 高度 默认300
/>
```

## fieldList 输入@符号才能调起
```
fieldList: [
    { name: "放款金额", value: "fkje"},
    { name: "实际放款金额", value: "sjfkje"},
    { name: "借款人姓名", value: "jkrxm"},
    { name: "借款人手机号", value: "jkrsjh"},
    { name: "借款人身份证", value: "jkrsfz"},
],
```
## methodList 输入#符号才能调起
```
methodList: [
    { name: "平均值", value: "平均值(,)", realValue: "avg" },
    { name: "最大值", value: "最大值(,)", realValue: "max" },
    { name: "最小值", value: "最小值(,)", realValue: "min" },
    { name: "求和", value: "求和(,)", realValue: "sum" }
],
```
## normalList 自定义无需校验关键词
```
normalList: [
    { name: "且", value: "and" },
    { name: "或", value: "or" }
],
```

## 特殊数据场景 @STRINGαC_S_CARDNO
```
const typeKeyWords = ['αINT', 'αSTRING', 'αDOUBLE', 'αBOOLEAN', 'αDATETIME', 'αLONG', 'αENUM', 'αJSON'];

const enCodeToCnExtraLogic = (enCode) => {
    const regExp = new RegExp(`(${typeKeyWords.join('|')})`, 'g');
    const cnCode = enCode.replace(regExp, () => {
        return '';
    });
    return cnCode;
};

<FormulaEdit
    value='@hahahdsdhjbewdbu1#avg(,)andhhhhhhh' //传入组件自动转化成cnCode
    fieldList={testData} // @唤起
    regRxp="@[^\\+\\*\\/#%\\(\\),;\\!\\<\\>\\-=@]*" //中文转英文默认正则
    typeMap={{'OBJECT':{'displayName':'对象','color': 'blue'}}} // 下拉框 自定义展示类型和颜色
    methodList={methodList} // #唤起
    normalList={normalList} // 自定义无需校验关键词
    onChange={(enCode,data)=>{}} // 回调
    cnCodeToEnExtraLogic={(item) => {
        return `α${item.type}`;
    }}
    enCodeToCnExtraLogic={enCodeToCnExtraLogic}
/>
```

## 编辑器效果
![Image text](https://github.com/bruceliu68/formulaEdit-react/blob/master/src/img/pic1.png)
![Image text](https://github.com/bruceliu68/formulaEdit-react/blob/master/src/img/pic2.png)

## props参数：
|    参数    | 类型    |  默认值   |  是否必填  | 说明         |
| :------:  | :-----: | :----:   | :------: | :----------: |
| defaultValue | string  |  无      |   非必填    | 初始化赋值  2.0已废弃   |
| value | string  |  无      |   非必填    | 赋值  传入组件自动转化成cnCode |
| height    | number  |  300     |   非必填  | 高度设置       |
| theme    | string  |  day     |   非必填  | 主题: 目前只支持两种：day，night |
| readOnly  | boolean |  false   |   非必填  | 设置只读       |
| lineNumber  | boolean |  false   |   非必填  | 设置行号       |
| typeMap | object   |  无      |   非必填  | 自定义变量类型和颜色       |
| isEndMark | boolean   |  false      |   非必填  | 是否需要@结束符       |
| fieldList | array   |  无      |   非必填  | 字段列表       |
| methodList | array   |  无      |   非必填  | 方法列表       |
| normalList | array   |  无      |   非必填  | 自定义关键词列表       |
| onChange  | function(enCode, obj)|  无      |   非必填    | enCode, obj(里面有cnCode)      |

## 支持ref对外暴露方法
|    方法    | 类型    | 说明         |
| :------:  | :-----: | :----------: |
| fullScreen() | function  | 全屏     |
| exitFullScreen() | function  | 退出全屏     |
| insertValue(value) | function  | 光标处插入值     |

## License
MIT
