class MinimaxAlphaBetaPruning {
    /**@type {Function}
     * @return {Array.<*>}*/
    getAvailableMoves = null;
    /**@type {Function}
     * @return {{score, status} | null} null代表不能移动*/
    fnMove = null;

    constructor(props) {
        Object.assign(this, props);
    }

    doCalculate({isFirstPlayer, stepsLeft, score, status, alpha, beta}) {
        let bestMove = null;
        if (stepsLeft === 0) {
            return {bestMove: null, alpha: score, beta: score};
        } else {
            this.getAvailableMoves(isFirstPlayer, status).some(movement => {
                const moveRes = this.fnMove(isFirstPlayer, movement, score, status && status.clone());
                if (moveRes) {
                    const {alpha: subAlpha, beta: subBeta} = this.doCalculate({
                        isFirstPlayer: !isFirstPlayer,
                        stepsLeft: stepsLeft - 1,
                        score: moveRes.score,
                        status: moveRes.status,
                        alpha,
                        beta
                    });

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

            return {bestMove, alpha, beta};
        }
    }
}

export function calculateNextMove({isFirstPlayer, stepsToConsider, getAvailableMoves, fnMove, score, status}) {
    const calculator = new MinimaxAlphaBetaPruning({
        fnMove,
        getAvailableMoves
    });
    return calculator.doCalculate({
        isFirstPlayer: isFirstPlayer,
        stepsLeft: stepsToConsider,
        score,
        status,
        alpha: -Infinity,
        beta: Infinity
    }).bestMove;
}
