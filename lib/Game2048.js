'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.getEmptyPositions = getEmptyPositions;
exports.getMoveResult = getMoveResult;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderComponent = require('react-pure-render/component');

var _reactPureRenderComponent2 = _interopRequireDefault(_reactPureRenderComponent);

var _reactAddonsCssTransitionGroup = require('react-addons-css-transition-group');

var _reactAddonsCssTransitionGroup2 = _interopRequireDefault(_reactAddonsCssTransitionGroup);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodashForEach = require('lodash/forEach');

var _lodashForEach2 = _interopRequireDefault(_lodashForEach);

var _lodashMapValues = require('lodash/mapValues');

var _lodashMapValues2 = _interopRequireDefault(_lodashMapValues);

var _jsAssert__assert__ = require('js-assert/__assert__');

var _jsAssert__assert__2 = _interopRequireDefault(_jsAssert__assert__);

var _reactDocumentEvent = require('react-document-event');

var _reactDocumentEvent2 = _interopRequireDefault(_reactDocumentEvent);

var _actions = require('./actions');

var _Game2048Player = require('./Game2048Player');

var _Game2048Player2 = _interopRequireDefault(_Game2048Player);

require('animate.css/source/_base.css');

require('animate.css/source/bouncing_entrances/bounceIn.css');

require('./Game2048.scss');

var pieceSize = 100; // 棋子大小(单位: 像素)
var TransitionDuration = 200;
var AnimationEnterDuration = 1000;
var AnimationLeaveDuration = 200;

/** Direction */
var UP = 'u',
    RIGHT = 'r',
    DOWN = 'd',
    LEFT = 'l';
var key2direction = {
    37: LEFT,
    38: UP,
    39: RIGHT,
    40: DOWN
};

var lastId = 0;
// 获取顺序递增的uid
function getUID() {
    var uid = Date.now();
    if (uid <= lastId) {
        uid = lastId + 1;
    }
    lastId = uid;
    return uid;
}
/** 生成一枚新棋子
 * @param {int} num */
var getNewPiece = function getNewPiece(num) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$doubled = _ref.doubled;
    var doubled = _ref$doubled === undefined ? false : _ref$doubled;
    return _immutable2['default'].fromJS({
        uid: getUID(),
        num: num,
        doubled: doubled
    });
};

exports.getNewPiece = getNewPiece;
/** 坐标转换: 行/列 转 单索引 */
var rc2i = function rc2i(size, row, col) {
    return row * size + col;
};
/** 坐标转换: 单索引 转 行/列 */
var i2rc = function i2rc(size, i) {
    return {
        row: Math.floor(i / size),
        col: i % size
    };
};

function getEmptyPositions(pieces, size) {
    var emptyPos = [],
        len = size * size;
    for (var i = 0; i < len; i++) {
        if (!pieces.get(i)) {
            emptyPos.push(i);
        }
    }
    return emptyPos;
}

/** 根据棋牌状态, 计算走一步之后的结果
 * 返回值:
 *  - hasMoved: 下棋后是否能移动
 *  - hasDoubling: 下棋后是否会导致某棋子翻倍
 *  - score: 下棋后的分数
 *  - pieces: 下棋后的最终棋牌状态
 *  - movingPieces: {List.<List | Map>} 下棋后棋子翻倍前的中间移动状态, 其中合并翻倍的两个棋子共用同一个位置, 因而该处值为棋子数组而非单个棋子 */

function getMoveResult(_ref2) {
    var pieces = _ref2.pieces;
    var score = _ref2.score;
    var size = _ref2.size;
    var direction = _ref2.direction;

    (0, _jsAssert__assert__2['default'])([UP, RIGHT, DOWN, LEFT].indexOf(direction) !== -1);

    var hasMoved = false,
        hasDoubling = false,
        isHorizon = direction === LEFT || direction === RIGHT,
        isPositive = direction === RIGHT || direction === DOWN,
        step = isPositive ? 1 : -1,
        // Step that controls square movement direction
    scanStep = -step,
        // Step that controls scan direction
    getPos = function getPos(_a1, _a2) {
        return isHorizon ? rc2i(size, _a1, _a2) : rc2i(size, _a2, _a1);
    };

    // Scan each square
    for (var a1 = 0; a1 < size; a1++) {
        var a2 = isPositive ? size - 1 : 0;
        while (0 <= a2 && a2 < size) {
            // Do moving for one square
            var pPos = getPos(a1, a2),
                // Original piece position
            piece = pieces.get(pPos); // Original piece
            if (piece) {
                var pNum = piece.get('num'),
                    // Original square number
                pNewA2 = a2 + step,
                    // New axis two that the square will move to
                existedPieceThere = undefined; // Existing square in new position
                while (0 <= pNewA2 && pNewA2 < size && (!(existedPieceThere = pieces.get(getPos(a1, pNewA2))) || !(existedPieceThere instanceof _immutable.List) && existedPieceThere.get('num') === pNum)) {
                    pNewA2 += step;
                }
                pNewA2 -= step;
                if (pNewA2 !== a2) {
                    var pNewPos = getPos(a1, pNewA2);
                    existedPieceThere = pieces.get(pNewPos);
                    pieces = pieces.set(pPos, null).set(pNewPos, existedPieceThere ? (0, _immutable.List)([existedPieceThere, piece]) : piece);
                    hasMoved = true;
                    hasDoubling = hasDoubling || !!existedPieceThere;
                }
            }

            // Increase to scan next square
            a2 += scanStep;
        }
    }

    var finalPieces = !hasDoubling ? pieces : pieces.map(function (piece) {
        if (piece && piece instanceof _immutable.List) {
            (0, _jsAssert__assert__2['default'])(piece.size === 2 && _immutable2['default'].Set(piece.map(function (p) {
                return p.get('num');
            })).size === 1); // 验证合并的两个棋子数字相等
            var newNum = piece.get(0).get('num') * 2;
            score += newNum;
            return getNewPiece(newNum, { doubled: true });
        } else {
            return piece;
        }
    });

    return {
        hasMoved: hasMoved,
        hasDoubling: hasDoubling,
        score: score,
        pieces: finalPieces,
        movingPieces: pieces
    };
}

__TEST__ && (window.getMoveResult = getMoveResult);

/**随机生成新棋子
 * @return {Object.<pos, piece>} 索引为棋子位置*/
function randomPopNewPieces(pieces, size) {
    var count = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

    var newPieces = {};
    var emptyPos = getEmptyPositions(pieces, size);
    count = count > emptyPos.length ? emptyPos.length : count;
    while (count > 0) {
        var idx = Math.floor(Math.random() * emptyPos.length);
        newPieces[emptyPos[idx]] = getNewPiece(2); // TODO: Math.random() < 0.9 ? 2 : 4;
        emptyPos.splice(idx, 1);
        count--;
    }
    return newPieces;
}

function putPieces(pieces, newPieceMap) {
    (0, _lodashForEach2['default'])(newPieceMap, function (piece, pos) {
        pieces = pieces.set(pos, piece);
    });
    return pieces;
}

var Game2048 = (function (_Component) {
    _inherits(Game2048, _Component);

    function Game2048() {
        var _this = this;

        _classCallCheck(this, Game2048);

        _get(Object.getPrototypeOf(Game2048.prototype), 'constructor', this).apply(this, arguments);

        this.size = 4;
        this.state = {
            flashingScore: false
        };

        this.popNewPieces = function (pieces, size) {
            return randomPopNewPieces(pieces, size, 1);
        };

        this._moving = false;

        this.onDocumentKeyDown = function (e) {
            var direction = key2direction[e.keyCode];
            if (direction) {
                _this.move(direction);
            }
        };
    }

    _createClass(Game2048, [{
        key: 'configure',
        value: function configure(_ref3) {
            var popNewPieces = _ref3.popNewPieces;

            this.popNewPieces = popNewPieces;
        }
    }, {
        key: 'move',
        value: function move(direction) {
            var _this2 = this;

            __TEST__ && (window.moves = (window.moves || []).concat([direction]));

            var _props = this.props;
            var pieces = _props.pieces;
            var score = _props.score;
            var dispatch = _props.dispatch;

            var _getMoveResult = getMoveResult({
                pieces: pieces, score: score, direction: direction,
                size: this.size
            });

            var hasMoved = _getMoveResult.hasMoved;
            var hasDoubling = _getMoveResult.hasDoubling;
            var movingPieces = _getMoveResult.movingPieces;
            var finalPieces = _getMoveResult.pieces;
            var finalScore = _getMoveResult.score;

            if (hasMoved && !this._moving) {
                (function () {
                    var newPieceMap = _this2.popNewPieces(movingPieces, _this2.size);

                    __TEST__ && (window.newPieces = (window.newPieces || []).concat([(0, _lodashMapValues2['default'])(newPieceMap, function (p) {
                        return p.toJS();
                    })]));

                    dispatch((0, _actions.setPiecesAction)(putPieces(movingPieces, newPieceMap)));

                    if (hasDoubling) {
                        _this2._moving = true;
                        window.setTimeout(function () {
                            dispatch((0, _actions.setPiecesAction)(putPieces(finalPieces, newPieceMap)));
                            dispatch((0, _actions.setScoreAction)(finalScore));
                            _this2._moving = false;
                        }, TransitionDuration);
                    }
                })();
            }

            return hasMoved;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var _this3 = this;

            if (nextProps.score !== this.props.score) {
                // 分数变化时, 闪烁分数
                clearTimeout(this._clearFlashingTimer);
                this.setState({ flashingScore: true }, function () {
                    _this3._clearFlashingTimer = setTimeout(function () {
                        return _this3.setState({ flashingScore: false });
                    }, 500);
                });
            }
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _props2 = this.props;
            var pieces = _props2.pieces;
            var dispatch = _props2.dispatch;

            dispatch((0, _actions.setPiecesAction)(putPieces(pieces, randomPopNewPieces(pieces, this.size, 2))));
        }
    }, {
        key: 'render',
        value: function render() {
            var _props3 = this.props;
            var pieces = _props3.pieces;
            var score = _props3.score;

            var size = this.size;
            var getPieceStyle = function getPieceStyle(pieceInfo) {
                var _i2rc = i2rc(size, pieceInfo.get('pos'));

                var row = _i2rc.row;
                var col = _i2rc.col;

                return {
                    zIndex: pieceInfo.get('num') + (pieceInfo.get('innerIndex') || 0),
                    top: row * pieceSize,
                    left: col * pieceSize
                };
            };

            var orderedPieces = (0, _immutable.List)();
            for (var i = 0; i < size; i++) {
                var _loop = function (j) {
                    var pos = rc2i(size, i, j),
                        piece = pieces.get(pos);
                    if (piece) {
                        if (piece instanceof _immutable.List) {
                            orderedPieces = orderedPieces.concat(piece.map(function (p, idx) {
                                return p.set('pos', pos).set('innerIndex', idx);
                            }));
                        } else {
                            orderedPieces = orderedPieces.push(piece.set('pos', pos));
                        }
                    }
                };

                for (var j = 0; j < size; j++) {
                    _loop(j);
                }
            }
            // 按固定uid顺序排序, 以保证react渲染时节点顺序保持不变 (否则会丢失动画效果)
            orderedPieces = orderedPieces.sortBy(function (p) {
                return p.get('uid');
            });

            return _react2['default'].createElement(
                _reactDocumentEvent2['default'],
                { onKeyDown: this.onDocumentKeyDown },
                _react2['default'].createElement(
                    'div',
                    { className: 'Game2048' },
                    _react2['default'].createElement(
                        'div',
                        { className: 'score' },
                        'score:',
                        _react2['default'].createElement(
                            'span',
                            { className: 'score-num ' + (this.state.flashingScore ? 'flashing' : '') },
                            score
                        )
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'game2048-content' },
                        _react2['default'].createElement(
                            'div',
                            { className: 'background-container' },
                            new Array(size).fill(0).map(function (v, idx) {
                                return _react2['default'].createElement(
                                    'div',
                                    { key: idx, className: 'bg-pieces-row' },
                                    new Array(size).fill(0).map(function (v, idx) {
                                        return _react2['default'].createElement('div', { key: idx, className: 'piece' });
                                    })
                                );
                            })
                        ),
                        _react2['default'].createElement(
                            'div',
                            { className: 'pieces-container' },
                            _react2['default'].createElement(
                                _reactAddonsCssTransitionGroup2['default'],
                                { transitionName: 'piece', transitionAppear: false,
                                    transitionEnterTimeout: AnimationEnterDuration, transitionLeaveTimeout: AnimationLeaveDuration },
                                orderedPieces.map(function (pInfo) {
                                    var _cn;

                                    return _react2['default'].createElement(
                                        'div',
                                        { key: pInfo.get('uid'), style: getPieceStyle(pInfo),
                                            className: 'piece num' + pInfo.get('num') + ' ' + (pInfo.get('doubled') && 'doubled' || ''),
                                            className: (0, _classnames2['default'])((_cn = { 'piece': true }, _defineProperty(_cn, 'num' + pInfo.get('num'), true), _defineProperty(_cn, 'doubled', pInfo.get('doubled')), _cn)) },
                                        pInfo.get('num')
                                    );
                                })
                            )
                        )
                    ),
                    _react2['default'].createElement(_Game2048Player2['default'], { game2048: this })
                )
            );
        }
    }], [{
        key: 'propTypes',
        value: {
            dispatch: _react.PropTypes.func.isRequired,
            pieces: _react.PropTypes.instanceOf(_immutable2['default'].List).isRequired,
            score: _react.PropTypes.number.isRequired
        },
        enumerable: true
    }]);

    return Game2048;
})(_reactPureRenderComponent2['default']);

exports['default'] = Game2048;
// 2048 棋牌大小

/** 移动成功后放置新棋子的方法
 * @type {function.<pieces, size>}
 * @returns {{pos: <piece>}}. 默认函数返回一个随机位置的棋子 */