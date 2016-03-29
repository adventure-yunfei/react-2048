'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _Game2048 = require('./Game2048');

var _Game20482 = _interopRequireDefault(_Game2048);

var store = (0, _redux.createStore)(_reducer2['default']);

var ConnectedGame2048 = (0, _reactRedux.connect)(function (state) {
    return {
        pieces: state.get('pieces'),
        score: state.get('score')
    };
})(_Game20482['default']);

(0, _reactDom.render)(_react2['default'].createElement(
    _reactRedux.Provider,
    { store: store },
    _react2['default'].createElement(ConnectedGame2048, null)
), document.getElementById('app'));