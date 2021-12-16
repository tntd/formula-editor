"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

require("antd/es/empty/style");

var _empty = _interopRequireDefault(require("antd/es/empty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

require("antd/es/select/style");

var _select = _interopRequireDefault(require("antd/es/select"));

var _react = _interopRequireWildcard(require("react"));

var _DropDownWrap = _interopRequireDefault(require("./DropDownWrap"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

// 页面实际渲染的下拉菜单数量，实际为 2 * ITEM_ELEMENT_NUMBER
var ITEM_ELEMENT_NUMBER = 30; // Select size 配置

var ITEM_HEIGHT_CFG = {
  small: 24,
  large: 40,
  "default": 32
};
var ARROW_CODE = {
  40: "down",
  38: "up"
};
var DROPDOWN_HEIGHT = 224;
var Option = _select["default"].Option;

var SuperSelect =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2["default"])(SuperSelect, _PureComponent);

  function SuperSelect(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, SuperSelect);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(SuperSelect).call(this, props));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "turnChildren", function (children) {
      if (!children) return [];
      var arr = [];

      if (children && children.props) {
        arr.push(children);
      } else {
        children.forEach(function (item) {
          if (item) {
            if (item instanceof Array) {
              arr = arr.concat(item);
            } else {
              arr.push(item);
            }
          }
        });
      }

      return arr;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "formulaWidth", function () {
      // 获取dom设置宽度
      var _this$props = _this.props,
          arr2 = _this$props.children,
          _this$props$dropdownM = _this$props.dropdownMatchSelectWidth,
          dropdownMatchSelectWidth = _this$props$dropdownM === void 0 ? true : _this$props$dropdownM,
          maxWidth = _this$props.maxWidth;
      var selectDom = document.getElementById(_this.id);
      var selectWidth = selectDom.clientWidth || selectDom.offsetWidth;
      var arr = [];
      var formulaMaxWidth = 10;

      if (!dropdownMatchSelectWidth) {
        formulaMaxWidth = maxWidth || 10;
      }

      if (!dropdownMatchSelectWidth && !maxWidth) {
        var children = _this.turnChildren(arr2);

        for (var i = 0; i < children.length; i++) {
          var val = children[i].props.children;

          var textWidth = _this.getTextPixelWith(val);

          arr.push(textWidth.toFixed(2));
        }

        if (arr.length > 0) {
          formulaMaxWidth = Math.max.apply(Math, arr);
        }
      }

      _this.setState({
        selectWidth: selectWidth,
        maxWidth: formulaMaxWidth
      });
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getTextPixelWith", function (text) {
      var fontStyle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "14px";
      var canvas = document.createElement("canvas"); // 创建 canvas 画布

      var context = canvas.getContext("2d"); // 获取 canvas 绘图上下文环境

      context.font = fontStyle; // 设置字体样式，使用前设置好对应的 font 样式才能准确获取文字的像素长度

      var dimension = context.measureText(text); // 测量文字

      return dimension.width;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getItemStyle", function (i) {
      return {
        position: "absolute",
        top: _this.ITEM_HEIGHT * i,
        width: "100%",
        height: _this.ITEM_HEIGHT
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "addEvent", function () {
      _this.scrollEle = document.querySelector(".".concat(_this.dropdownClassName)); // 下拉菜单未展开时元素不存在

      if (!_this.scrollEle) return;

      _this.scrollEle.addEventListener("scroll", _this.onScroll, false);

      _this.inputEle = document.querySelector("#".concat(_this.id));
      if (!_this.inputEle) return;

      _this.inputEle.addEventListener("keydown", _this.onKeyDown, false);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onKeyDown", function (e) {
      var _ref = e || {},
          keyCode = _ref.keyCode;

      setTimeout(function () {
        var activeItem = document.querySelector(".".concat(_this.dropdownClassName, " .ant-select-dropdown-menu-item-active"));
        if (!activeItem) return;
        var offsetTop = activeItem.offsetTop;
        var isUp = ARROW_CODE[keyCode] === "up";
        var isDown = ARROW_CODE[keyCode] === "down"; // 在所有列表第一行按上键

        if (offsetTop - _this.prevTop > DROPDOWN_HEIGHT && isUp) {
          _this.scrollEle.scrollTo(0, _this.allHeight - DROPDOWN_HEIGHT);

          _this.prevTop = _this.allHeight;
          return;
        } // 在所有列表中最后一行按下键


        if (_this.prevTop > offsetTop + DROPDOWN_HEIGHT && isDown) {
          _this.scrollEle.scrollTo(0, 0);

          _this.prevTop = 0;
          return;
        }

        _this.prevTop = offsetTop; // 向下滚动到下拉框最后一行时，向下滚动一行的高度

        if (offsetTop > _this.scrollEle.scrollTop + DROPDOWN_HEIGHT - _this.ITEM_HEIGHT + 10 && isDown) {
          _this.scrollEle.scrollTo(0, _this.scrollTop + _this.ITEM_HEIGHT);

          return;
        } // 向上滚动到下拉框第一一行时，向上滚动一行的高度


        if (offsetTop < _this.scrollEle.scrollTop && isUp) {
          _this.scrollEle.scrollTo(0, _this.scrollTop - _this.ITEM_HEIGHT);
        }
      }, 100);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onScroll", function () {
      return _this.throttleByHeight(_this.onScrollReal);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onScrollReal", function () {
      _this.allList = _this.getUseChildrenList();

      var _this$getStartAndEndI = _this.getStartAndEndIndex(),
          startIndex = _this$getStartAndEndI.startIndex,
          endIndex = _this$getStartAndEndI.endIndex;

      _this.prevScrollTop = _this.scrollTop; // 重新渲染列表组件 Wrap

      var allHeight = _this.allList.length * _this.ITEM_HEIGHT || 100;

      _this.wrap.reactList(allHeight, startIndex, endIndex);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "throttleByHeight", function () {
      _this.scrollTop = _this.scrollEle.scrollTop; // 滚动的高度

      var delta = _this.prevScrollTop - _this.scrollTop;
      delta = delta < 0 ? 0 - delta : delta;
      delta > _this.reactDelta && _this.onScrollReal();
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getUseChildrenList", function () {
      return _this.state.filterChildren || _this.state.children;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getStartAndEndIndex", function () {
      // 滚动后显示在列表可视区中的第一个 item 的 index
      var showIndex = Number((_this.scrollTop / _this.ITEM_HEIGHT).toFixed(0));
      var startIndex = showIndex - ITEM_ELEMENT_NUMBER < 0 ? 0 : showIndex - ITEM_ELEMENT_NUMBER / 2;
      var endIndex = showIndex + ITEM_ELEMENT_NUMBER;
      return {
        startIndex: startIndex,
        endIndex: endIndex
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setSuperDrowDownMenu", function (visible) {
      if (!visible) return;
      _this.allList = _this.getUseChildrenList();

      if (!_this.eventTimer || !_this.scrollEle) {
        _this.eventTimer = setTimeout(function () {
          return _this.addEvent();
        }, 0);
      } else {
        var allHeight = _this.allList.length * _this.ITEM_HEIGHT || 100; // 下拉列表单独重新渲染

        var _this$getStartAndEndI2 = _this.getStartAndEndIndex(),
            startIndex = _this$getStartAndEndI2.startIndex,
            endIndex = _this$getStartAndEndI2.endIndex;

        setTimeout(function () {
          _this.wrap && _this.wrap.reactList(allHeight, startIndex, endIndex);
        }, 0);
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onDropdownVisibleChange", function (visible) {
      var onDropdownVisibleChange = _this.props.onDropdownVisibleChange;
      onDropdownVisibleChange && onDropdownVisibleChange(visible);
      var _this$state = _this.state,
          value = _this$state.value,
          children = _this$state.children; // 关闭下拉框前清空筛选条件，防止下次打开任然显示筛选后的 options

      if (!visible) {
        // 定时器确保关闭后再设置 filterChildren,防止列表刷新闪烁
        setTimeout(function () {
          _this.setState({
            filterChildren: null
          });

          _this.setDefaultScrollTop(value);
        }, 100); // this.removeEvent();
      } else {
        // this.addEvent();
        if (value) {
          // 如果已有 value, 设置默认滚动位置
          _this.setDefaultScrollTop(); // 设置下拉列表显示数据


          _this.setSuperDrowDownMenu(visible);
        } else if (!value && value !== 0 && children && children.length > 0) {
          // 无数据时，下拉回归至第一个
          var val = children[0].props.value;

          _this.setDefaultScrollTop(val);
        }
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onDeselect", function (value) {
      var onDeselect = _this.props.onDeselect;
      onDeselect && onDeselect(value);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onChange", function (value, opt) {
      var _this$props2 = _this.props,
          showSearch = _this$props2.showSearch,
          onChange = _this$props2.onChange,
          autoClearSearchValue = _this$props2.autoClearSearchValue,
          maxCount = _this$props2.maxCount,
          mode = _this$props2.mode;

      if (showSearch || _this.isMultiple) {
        // 搜索模式下选择后是否需要重置搜索状态
        if (autoClearSearchValue !== false) {
          _this.setState({
            filterChildren: null
          }, function () {
            // 搜索成功后重新设置列表的总高度
            _this.setSuperDrowDownMenu(true);
          });
        }
      }

      if (mode === "multiple") {
        if (value.length <= maxCount) {
          _this.setState({
            value: value
          });
        }
      } else {
        _this.setState({
          value: value
        });
      }

      onChange && onChange(value, opt);

      if (mode !== "multiple") {
        _this.select && _this.select.blur();
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "onSearch", function (v) {
      var _this$props3 = _this.props,
          showSearch = _this$props3.showSearch,
          onSearch = _this$props3.onSearch,
          filterOption = _this$props3.filterOption,
          arr = _this$props3.children;

      var children = _this.turnChildren(arr);

      if (showSearch && filterOption !== false) {
        // 须根据 filterOption（如有该自定义函数）手动 filter 搜索匹配的列表
        var filterChildren = null;

        if (typeof filterOption === "function") {
          filterChildren = children.filter(function (item) {
            return filterOption(v, item);
          });
        } else if (filterOption === undefined) {
          filterChildren = children.filter(function (item) {
            return _this.filterOption(v, item);
          });
        } // 搜索框有值，去除disabled=true的children


        var newFilterChild = [];
        filterChildren && filterChildren.forEach(function (item, index) {
          if (!item.props.disabled) {
            newFilterChild.push(item);
          }
        });
        filterChildren = newFilterChild; // 设置下拉列表显示数据

        _this.setState({
          filterChildren: v === "" ? null : filterChildren
        }, function () {
          setTimeout(function () {
            // 搜索后需要重置滚动位置到0，防止上次 scrollTop 位置无数据
            if (filterChildren) {
              _this.scrollTop = 0;

              _this.scrollEle.scrollTo(0, 0);
            } // 搜索成功后需要重新设置列表的总高度


            _this.setSuperDrowDownMenu(true);
          }, 0);
        });
      }

      onSearch && onSearch(v);
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "filterOption", function (v, option) {
      // 自定义过滤对应的 option 属性配置
      var filterProps = _this.props.optionFilterProp || "value";
      return "".concat(option.props[filterProps]).indexOf(v) >= 0;
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "setDefaultScrollTop", function (data) {
      var value = _this.state.value;
      var arr = _this.props.children;

      var children = _this.turnChildren(arr);

      var val = data || data === 0 ? data : value;

      for (var i = 0; i < children.length; i++) {
        var item = children[i];
        var itemValue = item.props.value;

        if (itemValue === val || Array.isArray(val) && val.includes(itemValue)) {
          var _ret = function () {
            var targetScrollTop = i * _this.ITEM_HEIGHT;
            setTimeout(function () {
              if (!_this.scrollEle) {
                _this.addEvent();
              }

              _this.scrollEle && _this.scrollEle.scrollTo(0, targetScrollTop);
            }, 100);
            return {
              v: void 0
            };
          }();

          if ((0, _typeof2["default"])(_ret) === "object") return _ret.v;
        }
      }
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "removeEvent", function () {
      if (!_this.scrollEle) return;

      _this.scrollEle.removeEventListener("scroll", _this.onScroll, false);

      if (!_this.inputEle) return;

      _this.inputEle.removeEventListener("keydown", _this.onKeyDown, false);
    });
    var _mode = props.mode,
        defaultValue = props.defaultValue,
        _value = props.value,
        optionHeight = props.optionHeight,
        _arr = props.children;
    _this.isMultiple = ["tags", "multiple"].includes(_mode);

    var _children = _this.turnChildren(_arr); // 设置默认 value


    var defaultV = _this.isMultiple ? [] : "";
    defaultV = _value || defaultValue || defaultV;
    _this.state = {
      children: _children || [],
      filterChildren: null,
      // 筛选后的 options，优先显示，所以清除筛选后手动设为 null
      value: defaultV,
      maxWidth: null,
      selectWidth: null
    }; // 下拉菜单项行高

    _this.ITEM_HEIGHT = optionHeight || ITEM_HEIGHT_CFG[props.size || "default"]; // 可视区 dom 高度

    _this.visibleDomHeight = _this.ITEM_HEIGHT * ITEM_ELEMENT_NUMBER; // 滚动时重新渲染的 scrollTop 判断值，大于 reactDelta 则刷新下拉列表

    _this.reactDelta = _this.visibleDomHeight / 3; // 是否拖动滚动条快速滚动状态

    _this.isStopReact = false; // 上一次滚动的 scrollTop 值

    _this.prevScrollTop = 0; // 上一次按下方向键时 scrollTop 值

    _this.prevTop = 0;
    _this.scrollTop = 0; // className

    _this.dropdownClassName = "dc".concat(+new Date());
    _this.id = "sid".concat(+new Date());
    return _this;
  }

  (0, _createClass2["default"])(SuperSelect, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // defaultOpens=true 时添加滚动事件
      setTimeout(function () {
        _this2.addEvent();
      }, 500);
      var arr = this.props.children;
      var children = this.turnChildren(arr);

      if (children && children.length > 0) {
        this.formulaWidth();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props4 = this.props,
          mode = _this$props4.mode,
          defaultValue = _this$props4.defaultValue,
          value = _this$props4.value,
          children = _this$props4.children;
      var arr = this.turnChildren(children);

      if (prevProps.children !== children) {
        this.isMultiple = ["tags", "multiple"].includes(mode);
        this.setState({
          children: arr || [],
          filterChildren: null
        });

        if (arr && arr.length > 0) {
          this.formulaWidth();
        }
      }

      if (prevProps.value !== value) {
        // 更新时设置默认 value
        var defaultV = this.isMultiple ? [] : "";
        defaultV = value || defaultValue || defaultV;
        this.setState({
          value: defaultV
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeEvent();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state2 = this.state,
          maxWidth = _this$state2.maxWidth,
          selectWidth = _this$state2.selectWidth;
      var _this$props5 = this.props,
          dropdownStyle = _this$props5.dropdownStyle,
          optionLabelProp = _this$props5.optionLabelProp,
          dropdownClassName = _this$props5.dropdownClassName,
          props = (0, _objectWithoutProperties2["default"])(_this$props5, ["dropdownStyle", "optionLabelProp", "dropdownClassName"]);
      this.allList = this.getUseChildrenList();
      this.allHeight = this.allList.length * this.ITEM_HEIGHT || 100;

      var _this$getStartAndEndI3 = this.getStartAndEndIndex(),
          startIndex = _this$getStartAndEndI3.startIndex,
          endIndex = _this$getStartAndEndI3.endIndex;

      var dynamicWidth = maxWidth;

      if (this.allList.length === 0 || maxWidth < selectWidth) {
        dynamicWidth = selectWidth;
      }

      dropdownStyle = _objectSpread({
        maxHeight: "".concat(DROPDOWN_HEIGHT, "px")
      }, dropdownStyle, {
        overflow: "auto",
        position: "relative",
        maxWidth: dynamicWidth
      });
      var value = this.state.value; // 判断处于 antd Form 中时不自动设置 value

      var _props = _objectSpread({}, props); // 先删除 value，再手动赋值，防止空 value 影响 placeholder


      delete _props.value; // value 为空字符会隐藏 placeholder，改为 undefined

      if (typeof value === "string" && !value) {
        _props.value = undefined;
      } else {
        _props.value = value;
      }

      optionLabelProp = optionLabelProp || "children";
      return _react["default"].createElement(_select["default"], (0, _extends2["default"])({}, _props, {
        id: this.id,
        onSearch: this.onSearch,
        onChange: this.onChange,
        dropdownClassName: "".concat(this.dropdownClassName, " ").concat(dropdownClassName || ""),
        optionLabelProp: optionLabelProp,
        dropdownStyle: dropdownStyle,
        onDropdownVisibleChange: this.onDropdownVisibleChange,
        onDeselect: this.onDeselect,
        ref: function ref(ele) {
          return _this3.select = ele;
        },
        dropdownRender: function dropdownRender(menu, props) {
          if (_this3.allList.length === 0) {
            return _react["default"].createElement("div", {
              style: {
                padding: "5px 12px"
              }
            }, _react["default"].createElement(_empty["default"], {
              image: _empty["default"].PRESENTED_IMAGE_SIMPLE
            }));
          }

          return _react["default"].createElement(_DropDownWrap["default"], (0, _extends2["default"])({
            startIndex: startIndex,
            endIndex: endIndex,
            allHeight: _this3.allHeight,
            menu: menu,
            itemHeight: _this3.ITEM_HEIGHT
          }, {
            ref: function ref(ele) {
              _this3.wrap = ele;
            }
          }));
        }
      }), this.allList);
    }
  }]);
  return SuperSelect;
}(_react.PureComponent);

SuperSelect.Option = Option;
var _default = SuperSelect;
exports["default"] = _default;