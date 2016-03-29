"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.calculateNextMove = calculateNextMove;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Minimax = (function () {
    function Minimax(props) {
        _classCallCheck(this, Minimax);

        this.getAvailableMoves = null;
        this.fnMove = null;

        Object.assign(this, props);
    }

    _createClass(Minimax, [{
        key: "doCalculate",
        value: function doCalculate(_ref) {
            var _this = this;

            var isFirstPlayer = _ref.isFirstPlayer;
            var stepsLeft = _ref.stepsLeft;
            var score = _ref.score;
            var status = _ref.status;

            var bestRes = null;
            if (stepsLeft > 0) {
                this.getAvailableMoves(isFirstPlayer, status).forEach(function (movement) {
                    var moveRes = _this.fnMove(isFirstPlayer, movement, score, status && status.clone());
                    if (moveRes) {
                        var _doCalculate = _this.doCalculate({
                            isFirstPlayer: !isFirstPlayer,
                            stepsLeft: stepsLeft - 1,
                            score: moveRes.score,
                            status: moveRes.status
                        });

                        var finalScore = _doCalculate.score;

                        if (bestRes === null || (isFirstPlayer ? finalScore > bestRes.score : finalScore < bestRes.score)) {
                            bestRes = {
                                move: movement,
                                score: finalScore
                            };
                        }
                    }
                });
            }
            return bestRes || { move: null, score: score };
        }
    }]);

    return Minimax;
})();

function calculateNextMove(_ref2) {
    var isFirstPlayer = _ref2.isFirstPlayer;
    var stepsToConsider = _ref2.stepsToConsider;
    var getAvailableMoves = _ref2.getAvailableMoves;
    var fnMove = _ref2.fnMove;
    var score = _ref2.score;
    var status = _ref2.status;

    var calculator = new Minimax({
        fnMove: fnMove,
        getAvailableMoves: getAvailableMoves
    });
    return calculator.doCalculate({
        isFirstPlayer: isFirstPlayer,
        stepsLeft: stepsToConsider,
        score: score,
        status: status
    }).move;
}

/**@type {Function}
 * @return {Array.<*>}*/

/**@type {Function}
 * @return {{score, status}}*/