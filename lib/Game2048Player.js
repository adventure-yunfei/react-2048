'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactPureRenderComponent = require('react-pure-render/component');

var _reactPureRenderComponent2 = _interopRequireDefault(_reactPureRenderComponent);

var _materialUiLibPaper = require('material-ui/lib/paper');

var _materialUiLibPaper2 = _interopRequireDefault(_materialUiLibPaper);

var _materialUiLibRaisedButton = require('material-ui/lib/raised-button');

var _materialUiLibRaisedButton2 = _interopRequireDefault(_materialUiLibRaisedButton);

var _Game2048 = require('./Game2048');

var _algorithmMinimax = require('./algorithm/minimax');

var minimax = _interopRequireWildcard(_algorithmMinimax);

var MOVES = ['u', 'r', 'd', 'l'];

var Game2048Player = (function (_Component) {
    _inherits(Game2048Player, _Component);

    function Game2048Player() {
        var _this = this;

        _classCallCheck(this, Game2048Player);

        _get(Object.getPrototypeOf(Game2048Player.prototype), 'constructor', this).apply(this, arguments);

        this.calculateSteps = 3;
        this.state = {
            autoPlayOn: false,
            randomPlayOn: false,
            hardMode: false
        };

        this.toggleAutoPlay = function () {
            var game2048 = _this.props.game2048;
            var newAutoPlayOn = !_this.state.autoPlayOn;
            var calculateAndPlay = function calculateAndPlay() {
                if (_this.state.autoPlayOn) {
                    _this.props.game2048.move(_this.calculateNextMove({
                        pieces: game2048.props.pieces,
                        score: game2048.props.score,
                        size: game2048.size,
                        forPlayer: true
                    }));
                    window.setTimeout(calculateAndPlay, 300);
                }
            };
            _this.setState({
                autoPlayOn: newAutoPlayOn,
                randomPlayOn: false
            }, function () {
                return setTimeout(calculateAndPlay, 100);
            });
        };

        this.toggleRandomPlay = function () {
            var newRandomPlayOn = !_this.state.randomPlayOn;
            var randomAndPlay = function randomAndPlay() {
                if (_this.state.randomPlayOn) {
                    var randomMove = MOVES[Math.floor(Math.random() * MOVES.length)];
                    var hasMoved = _this.props.game2048.move(randomMove);
                    window.setTimeout(randomAndPlay, hasMoved ? 400 : 0);
                }
            };
            _this.setState({
                randomPlayOn: newRandomPlayOn,
                autoPlayOn: false
            }, function () {
                return setTimeout(randomAndPlay, 100);
            });
        };

        this.toggleHardMode = function () {
            var game2048 = _this.props.game2048;
            var newHardMode = !_this.state.hardMode;
            _this._originPopupNewPieces = _this._originPopupNewPieces || game2048.popNewPieces;
            if (newHardMode) {
                game2048.configure({
                    popNewPieces: function popNewPieces(pieces, size) {
                        var newPiecePos = _this.calculateNextMove({
                            pieces: pieces,
                            score: 0, // 分数对计算结果不影响
                            size: size,
                            forPlayer: false
                        });
                        return _defineProperty({}, newPiecePos, (0, _Game2048.getNewPiece)(2));
                    }
                });
            } else {
                game2048.configure({
                    popNewPieces: _this._originPopupNewPieces
                });
            }

            _this.setState({
                hardMode: newHardMode
            });
        };
    }

    _createClass(Game2048Player, [{
        key: 'calculateNextMove',
        value: function calculateNextMove(_ref2) {
            var pieces = _ref2.pieces;
            var score = _ref2.score;
            var size = _ref2.size;
            var _ref2$forPlayer = _ref2.forPlayer;
            var forPlayer = _ref2$forPlayer === undefined ? true : _ref2$forPlayer;

            var getAvailableMoves = function getAvailableMoves(isFirstPlayer, status) {
                if (isFirstPlayer) {
                    return MOVES;
                } else {
                    return (0, _Game2048.getEmptyPositions)(status.pieces, size);
                }
            },
                cloneStatus = function cloneStatus() {
                return _extends({}, this);
            },
                getStatus = function getStatus(pieces) {
                return {
                    pieces: pieces,
                    clone: cloneStatus
                };
            },
                fnMove = function fnMove(isFirstPlayer, movement, score, status) {
                if (isFirstPlayer) {
                    var moveRes = (0, _Game2048.getMoveResult)({
                        pieces: status.pieces,
                        score: score,
                        size: size,
                        direction: movement
                    });
                    return moveRes.hasMoved ? {
                        score: moveRes.score,
                        status: getStatus(moveRes.pieces)
                    } : null;
                } else {
                    return {
                        score: score,
                        status: getStatus(status.pieces.set(movement, (0, _Game2048.getNewPiece)(2))) // 暂时仅考虑数字2的棋子
                    };
                }
            };

            return minimax.calculateNextMove({
                isFirstPlayer: forPlayer,
                stepsToConsider: this.calculateSteps * 2 - 1,
                getAvailableMoves: getAvailableMoves,
                fnMove: fnMove,
                score: score,
                status: getStatus(pieces)
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state;
            var autoPlayOn = _state.autoPlayOn;
            var randomPlayOn = _state.randomPlayOn;
            var hardMode = _state.hardMode;

            return _react2['default'].createElement(
                'div',
                { className: 'Game2048Player' },
                _react2['default'].createElement(
                    _materialUiLibPaper2['default'],
                    { className: 'toggle-auto-play', zDepth: autoPlayOn ? 5 : 0 },
                    _react2['default'].createElement(_materialUiLibRaisedButton2['default'], { onClick: this.toggleAutoPlay, label: '自动玩游戏' })
                ),
                _react2['default'].createElement(
                    _materialUiLibPaper2['default'],
                    { className: 'toggle-random-play', zDepth: randomPlayOn ? 5 : 0 },
                    _react2['default'].createElement(_materialUiLibRaisedButton2['default'], { onClick: this.toggleRandomPlay, label: '随机玩' })
                ),
                _react2['default'].createElement(
                    _materialUiLibPaper2['default'],
                    { className: 'toggle-hard-mode', zDepth: hardMode ? 5 : 0 },
                    _react2['default'].createElement(_materialUiLibRaisedButton2['default'], { onClick: this.toggleHardMode, label: 'HARD模式' })
                )
            );
        }
    }], [{
        key: 'propTypes',
        value: {
            game2048: _react.PropTypes.object.isRequired
        },

        /** Step to pre-calculate when the auto-player determines the next movement
         * Consider only the steps of auto-player, so it's (calculateSteps * 2 - 1) total steps for minimax algorithm
         * @type int */
        enumerable: true
    }]);

    return Game2048Player;
})(_reactPureRenderComponent2['default']);

exports['default'] = Game2048Player;
module.exports = exports['default'];