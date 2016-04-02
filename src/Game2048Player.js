import React, {PropTypes} from 'react';
import Component from 'react-pure-render/component';
import Paper from 'material-ui/lib/paper';
import RaisedButton from 'material-ui/lib/raised-button';

import {getNewPiece, getMoveResult, getEmptyPositions} from './Game2048';
import * as minimax from './algorithm/minimax';

const MOVES = ['u', 'r', 'd', 'l'];

export default class Game2048Player extends Component {
    static propTypes = {
        game2048: PropTypes.object.isRequired
    };

    /** Step to pre-calculate when the auto-player determines the next movement
     * Consider only the steps of auto-player, so it's (calculateSteps * 2 - 1) total steps for minimax algorithm
     * @type int */
    calculateSteps = 3;

    state = {
        autoPlayOn: false,
        randomPlayOn: false,
        hardMode: false
    };

    calculateNextMove({pieces, score, size, forPlayer = true}) {
        const getAvailableMoves = (isFirstPlayer, status) => {
                if (isFirstPlayer) {
                    return MOVES;
                } else {
                    return getEmptyPositions(status.pieces, size);
                }
            },
            cloneStatus = function () { return {...this}; },
            getStatus = pieces => ({
                pieces,
                clone: cloneStatus
            }),
            fnMove = (isFirstPlayer, movement, score, status) => {
                if (isFirstPlayer) {
                    const moveRes = getMoveResult({
                        pieces: status.pieces,
                        score,
                        size: size,
                        direction: movement
                    });
                    return moveRes.hasMoved ? {
                        score: moveRes.score,
                        status: getStatus(moveRes.pieces)
                    } : null;
                } else {
                    return {
                        score,
                        status: getStatus(status.pieces.set(movement, getNewPiece(2))) // 暂时仅考虑数字2的棋子
                    };
                }
            };



        return minimax.calculateNextMove({
            isFirstPlayer: forPlayer,
            stepsToConsider: this.calculateSteps * 2 - 1,
            getAvailableMoves,
            fnMove,
            score: score,
            status: getStatus(pieces)
        });
    }

    toggleAutoPlay = () => {
        const {game2048} = this.props,
            newAutoPlayOn = !this.state.autoPlayOn;
        const calculateAndPlay = () => {
            if (this.state.autoPlayOn) {
                const nextMove = this.calculateNextMove({
                    pieces: game2048.props.pieces,
                    score: game2048.props.score,
                    size: game2048.size,
                    forPlayer: true
                });
                if (nextMove) {
                    this.props.game2048.move(nextMove);
                    window.setTimeout(calculateAndPlay, 300);
                }
            }
        };
        this.setState({
            autoPlayOn: newAutoPlayOn,
            randomPlayOn: false
        }, () => setTimeout(calculateAndPlay, 100));
    };

    toggleRandomPlay = () => {
        const newRandomPlayOn = !this.state.randomPlayOn;
        const randomAndPlay = () => {
            if (this.state.randomPlayOn) {
                const randomMove = MOVES[Math.floor(Math.random() * MOVES.length)];
                const hasMoved = this.props.game2048.move(randomMove);
                window.setTimeout(randomAndPlay, hasMoved ? 400 : 0);
            }
        };
        this.setState({
            randomPlayOn: newRandomPlayOn,
            autoPlayOn: false
        }, () => setTimeout(randomAndPlay, 100));
    };

    toggleHardMode = () => {
        const {game2048} = this.props,
            newHardMode = !this.state.hardMode;
        this._originPopupNewPieces = this._originPopupNewPieces || game2048.popNewPieces;
        if (newHardMode) {
            game2048.configure({
                popNewPieces: (pieces, size) => {
                    const newPiecePos = this.calculateNextMove({
                        pieces: pieces,
                        score: 0, // 分数对计算结果不影响
                        size: size,
                        forPlayer: false
                    });
                    return {
                        [newPiecePos]: getNewPiece(2)
                    };
                }
            });
        } else {
            game2048.configure({
                popNewPieces: this._originPopupNewPieces
            });
        }

        this.setState({
            hardMode: newHardMode
        });
    };


    render() {
        const {autoPlayOn, randomPlayOn, hardMode} = this.state;

        return (
            <div className="Game2048Player">
                <Paper className="toggle-auto-play" zDepth={autoPlayOn ? 5 : 0}><RaisedButton onClick={this.toggleAutoPlay} label="自动玩游戏"/></Paper>
                <Paper className="toggle-random-play" zDepth={randomPlayOn ? 5 : 0}><RaisedButton onClick={this.toggleRandomPlay} label="随机玩"/></Paper>
                <Paper className="toggle-hard-mode" zDepth={hardMode ? 5 : 0}><RaisedButton onClick={this.toggleHardMode} label="HARD模式"/></Paper>
            </div>
        );
    }
}
