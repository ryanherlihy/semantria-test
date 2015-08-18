"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var React = require("react");
var d3 = require("d3");

var DefaultScalesMixin = {
	propTypes: {
		barPadding: React.PropTypes.number
	},

	getDefaultProps: function getDefaultProps() {
		return {
			barPadding: 0.5
		};
	},

	componentWillMount: function componentWillMount() {
		this._makeScales(this.props);
	},

	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this._makeScales(nextProps);
	},

	_makeScales: function _makeScales(props) {
		var xScale = props.xScale;
		var xIntercept = props.xIntercept;
		var yScale = props.yScale;
		var yIntercept = props.yIntercept;

		if (!xScale) {
			var _ref = this._makeXScale();

			var _ref2 = _slicedToArray(_ref, 2);

			this._xScale = _ref2[0];
			this._xIntercept = _ref2[1];
		} else {
			var _ref3 = [xScale, xIntercept];

			var _ref32 = _slicedToArray(_ref3, 2);

			this._xScale = _ref32[0];
			this._xIntercept = _ref32[1];
		}

		if (!yScale) {
			var _ref4 = this._makeYScale();

			var _ref42 = _slicedToArray(_ref4, 2);

			this._yScale = _ref42[0];
			this._yIntercept = _ref42[1];
		} else {
			var _ref5 = [yScale, yIntercept];

			var _ref52 = _slicedToArray(_ref5, 2);

			this._yScale = _ref52[0];
			this._yIntercept = _ref52[1];
		}
	},

	_makeXScale: function _makeXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;

		var data = this._data;

		if (typeof x(values(data[0])[0]) === "number") {
			return this._makeLinearXScale();
		} else if (typeof x(values(data[0])[0]).getMonth === "function") {
			return this._makeTimeXScale();
		} else {
			return this._makeOrdinalXScale();
		}
	},

	_makeLinearXScale: function _makeLinearXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var extents = d3.extent(Array.prototype.concat.apply([], data.map(function (stack) {
			return values(stack).map(function (e) {
				return x(e);
			});
		})));

		var scale = d3.scale.linear().domain(extents).range([0, innerWidth]);

		var zero = d3.max([0, scale.domain()[0]]);
		var xIntercept = scale(zero);

		return [scale, xIntercept];
	},

	_makeOrdinalXScale: function _makeOrdinalXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;
		var barPadding = _props.barPadding;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var scale = d3.scale.ordinal().domain(values(data[0]).map(function (e) {
			return x(e);
		})).rangeRoundBands([0, innerWidth], barPadding);

		return [scale, 0];
	},

	_makeTimeXScale: function _makeTimeXScale() {
		var _props = this.props;
		var x = _props.x;
		var values = _props.values;
		var barPadding = _props.barPadding;
		var data = this._data;
		var innerWidth = this._innerWidth;

		var scale = d3.time.scale().domain(values(data[0]).map(function (e) {
			return x(e);
		})).range([0, innerWidth]);

		return [scale, 0];
	},

	_makeYScale: function _makeYScale() {
		var _props = this.props;
		var y = _props.y;
		var values = _props.values;

		var data = this._data;

		if (typeof y(values(data[0])[0]) === "number") {
			return this._makeLinearYScale();
		} else {
			return this._makeOrdinalYScale();
		}
	},

	_makeLinearYScale: function _makeLinearYScale() {
		var _props = this.props;
		var y = _props.y;
		var y0 = _props.y0;
		var values = _props.values;
		var data = this._data;
		var innerHeight = this._innerHeight;

		var extents = d3.extent(Array.prototype.concat.apply([], data.map(function (stack) {
			return values(stack).map(function (e) {
				return y0(e) + y(e);
			});
		})));

		extents = [d3.min([0, extents[0]]), extents[1]];

		var scale = d3.scale.linear().domain(extents).range([innerHeight, 0]);

		var zero = d3.max([0, scale.domain()[0]]);
		var yIntercept = scale(zero);

		return [scale, yIntercept];
	},

	_makeOrdinalYScale: function _makeOrdinalYScale() {
		var data = this._data;
		var innerHeight = this._innerHeight;

		var scale = d3.scale.ordinal().range([innerHeight, 0]);

		var yIntercept = scale(0);

		return [scale, yIntercept];
	}
};

module.exports = DefaultScalesMixin;