"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.calculateNextMove = calculateNextMove;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MinimaxAlphaBetaPruning = (function () {
    function MinimaxAlphaBetaPruning(props) {
        _classCallCheck(this, MinimaxAlphaBetaPruning);

        this.getAvailableMoves = null;
        this.fnMove = null;

        Object.assign(this, props);
    }

    _createClass(MinimaxAlphaBetaPruning, [{
        key: "doCalculate",
        value: function doCalculate(_ref) {
            var _this = this;

            var isFirstPlayer = _ref.isFirstPlayer;
            var stepsLeft = _ref.stepsLeft;
            var score = _ref.score;
            var status = _ref.status;
            var alpha = _ref.alpha;
            var beta = _ref.beta;

            var bestMove = null;
            if (stepsLeft === 0) {
                return { bestMove: null, alpha: score, beta: score };
            } else {
                this.getAvailableMoves(isFirstPlayer, status).some(function (movement) {
                    var moveRes = _this.fnMove(isFirstPlayer, movement, score, status && status.clone());
                    if (moveRes) {
                        var _doCalculate = _this.doCalculate({
                            isFirstPlayer: !isFirstPlayer,
                            stepsLeft: stepsLeft - 1,
                            score: moveRes.score,
                            status: moveRes.status,
                            alpha: alpha,
                            beta: beta
                        });

                        var subAlpha = _doCalculate.alpha;
                        var subBeta = _doCalculate.beta;

                        if (isFirstPlayer) {
                            if (subBeta > alpha) {
                                // 当前路径产生了玩家更好的解法, 更新玩家选择
                                alpha = subBeta;
                                bestMove = movement;
                            }
                            if (subBeta >= beta) {
                                // 当前路径产生了超出对手已知最优解的选择, 或对手无法产生更好的解, 对手不会选择到达这条路, 剪枝剩余选择
                                return true;
                            }
                        } else {
                            if (subAlpha < beta) {
                                // 当前路径产生了对手更好的解法, 更新对手选择
                                beta = subAlpha;
                                bestMove = movement;
                            }
                            if (subAlpha <= alpha) {
                                // 当前路径产生了低于玩家已知最优解的选择, 或玩家无法产生更好的解, 玩家不会选择到达这条路, 剪枝剩余选择
                                return true;
                            }
                        }
                    }
                });

                return { bestMove: bestMove, alpha: alpha, beta: beta };
            }
        }
    }]);

    return MinimaxAlphaBetaPruning;
})();

function calculateNextMove(_ref2) {
    var isFirstPlayer = _ref2.isFirstPlayer;
    var stepsToConsider = _ref2.stepsToConsider;
    var getAvailableMoves = _ref2.getAvailableMoves;
    var fnMove = _ref2.fnMove;
    var score = _ref2.score;
    var status = _ref2.status;

    var calculator = new MinimaxAlphaBetaPruning({
        fnMove: fnMove,
        getAvailableMoves: getAvailableMoves
    });
    return calculator.doCalculate({
        isFirstPlayer: isFirstPlayer,
        stepsLeft: stepsToConsider,
        score: score,
        status: status,
        alpha: -Infinity,
        beta: Infinity
    }).bestMove;
}

/**@type {Function}
 * @return {Array.<*>}*/

/**@type {Function}
 * @return {{score, status} | null} null代表不能移动*/