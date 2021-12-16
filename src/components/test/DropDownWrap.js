"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var DropDownWrap =
/*#__PURE__*/
function (_PureComponent) {
  (0, _inherits2["default"])(DropDownWrap, _PureComponent);

  function DropDownWrap(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, DropDownWrap);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DropDownWrap).call(this, props));
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "getItemStyle", function (i) {
      var itemHeight = _this.props.itemHeight;
      return {
        position: "absolute",
        top: itemHeight * i,
        height: itemHeight,
        width: "100%"
      };
    });
    (0, _defineProperty2["default"])((0, _assertThisInitialized2["default"])(_this), "reactList", function (allHeight, startIndex, endIndex) {
      return _this.setState({
        allHeight: allHeight,
        startIndex: startIndex,
        endIndex: endIndex
      });
    });
    var _allHeight = props.allHeight,
        _startIndex = props.startIndex,
        _endIndex = props.endIndex;
    _this.state = {
      allHeight: _allHeight,
      startIndex: _startIndex,
      endIndex: _endIndex
    };
    return _this;
  }

  (0, _createClass2["default"])(DropDownWrap, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (this.props.allHeight !== prevProps.allHeight) {
        this.setState({
          allHeight: this.props.allHeight
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var menu = this.props.menu;
      var _this$state = this.state,
          startIndex = _this$state.startIndex,
          endIndex = _this$state.endIndex,
          allHeight = _this$state.allHeight; // 截取 Select 下拉列表中需要显示的部分

      var cloneMenu = _react["default"].cloneElement(menu, {
        menuItems: menu.props.menuItems.slice(startIndex, endIndex).map(function (item, i) {
          var realIndex = (startIndex || 0) + Number(i);

          var style = _this2.getItemStyle(realIndex); // 未搜到数据提示高度使用默认高度


          if (item.key === "NOT_FOUND") {
            delete style.height;
          }

          return _react["default"].cloneElement(item, {
            style: _objectSpread({}, item.props.style, {}, style)
          });
        }),
        dropdownMenuStyle: _objectSpread({}, menu.props.dropdownMenuStyle, {
          height: allHeight,
          maxHeight: allHeight,
          overflow: "hidden"
        })
      });

      return cloneMenu;
    }
  }]);
  return DropDownWrap;
}(_react.PureComponent);

exports["default"] = DropDownWrap;