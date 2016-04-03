class Minimax {
    /**@type {Function}
     * @return {Array.<*>}*/
    getAvailableMoves = null;
    /**@type {Function}
     * @return {{score, status} | null} null代表不能移动*/
    fnMove = null;

    constructor(props) {
        Object.assign(this, props);
    }

    doCalculate({isFirstPlayer, stepsLeft, score, status}) {
        let bestRes = null;
        if (stepsLeft > 0) {
            this.getAvailableMoves(isFirstPlayer, status).forEach(movement => {
                const moveRes = this.fnMove(isFirstPlayer, movement, score, status && status.clone());
                if (moveRes) {
                    const {score: finalScore} = this.doCalculate({
                        isFirstPlayer: !isFirstPlayer,
                        stepsLeft: stepsLeft - 1,
                        score: moveRes.score,
                        status: moveRes.status
                    });
                    if (bestRes === null || (isFirstPlayer ? (finalScore > bestRes.score) : (finalScore < bestRes.score))) {
                        bestRes = {
                            move: movement,
                            score: finalScore
                        };
                    }
                }
            });
        }
        return bestRes || {move: null, score: score};
    }
}

export function calculateNextMove({isFirstPlayer, stepsToConsider, getAvailableMoves, fnMove, score, status}) {
    const calculator = new Minimax({
        fnMove,
        getAvailableMoves
    });
    return calculator.doCalculate({
        isFirstPlayer: isFirstPlayer,
        stepsLeft: stepsToConsider,
        score,
        status
    }).move;
}
