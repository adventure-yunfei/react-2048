'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = reducer;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _actions = require('./actions');

var actions = _interopRequireWildcard(_actions);

var defaultState = _immutable2['default'].fromJS({
    /** 纪录当前2048棋牌中的棋子信息
     * @type {immutable.List.<{uid: string, num: int, pos: int, node: HTMLElement|undefined, action: string, doubling: boolean|undefined}>} */
    pieces: _immutable2['default'].List(),
    /** 当前游戏分数 */
    score: 0
});

function reducer(state, _ref) {
    if (state === undefined) state = defaultState;
    var type = _ref.type;
    var payload = _ref.payload;

    switch (type) {
        case actions.setPiecesAction:
            return state.set('pieces', payload);
        case actions.setScoreAction:
            return state.set('score', payload);
        default:
            return state;
    }
}

module.exports = exports['default'];