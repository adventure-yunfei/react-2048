import React, {PropTypes} from 'react';
import Component from 'react-pure-render/component';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import immutable, {List} from 'immutable';
import cn from 'classnames';
import forEach from 'lodash/forEach';
import mapValues from 'lodash/mapValues';

import __assert__ from 'js-assert/__assert__';
import DocumentEvent from 'react-document-event';
import {setPiecesAction, setScoreAction} from './actions';
import Game2048Player from './Game2048Player';

import 'animate.css/source/_base.css';
import 'animate.css/source/bouncing_entrances/bounceIn.css';

import './Game2048.scss';

const pieceSize = 100; // 棋子大小(单位: 像素)
const TransitionDuration = 200;
const AnimationEnterDuration = 1000;
const AnimationLeaveDuration = 200;

/** Direction */
var UP = 'u',
    RIGHT = 'r',
    DOWN = 'd',
    LEFT = 'l';
const key2direction = {
    37: LEFT,
    38: UP,
    39: RIGHT,
    40: DOWN
};

let lastId = 0;
// 获取顺序递增的uid
function getUID() {
    let uid = Date.now();
    if (uid <= lastId) {
        uid = lastId + 1;
    }
    lastId = uid;
    return uid;
}
/** 生成一枚新棋子
 * @param {int} num */
export const getNewPiece = (num, {doubled = false} = {}) => immutable.fromJS({
    uid: getUID(),
    num: num,
    doubled: doubled
});

/** 坐标转换: 行/列 转 单索引 */
const rc2i = (size, row, col) => row * size + col;
/** 坐标转换: 单索引 转 行/列 */
const i2rc = (size, i) => ({
    row: Math.floor(i / size),
    col: i % size
});

export function getEmptyPositions(pieces, size) {
    const emptyPos = [],
        len = size * size;
    for (let i = 0; i < len; i++) {
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
export function getMoveResult({pieces, score, size, direction}) {
    __assert__([UP, RIGHT, DOWN, LEFT].indexOf(direction) !== -1);

    let hasMoved = false,
        hasDoubling = false,
        isHorizon = direction === LEFT || direction === RIGHT,
        isPositive = direction === RIGHT || direction === DOWN,
        step = isPositive ? 1 : -1, // Step that controls square movement direction
        scanStep = -step,           // Step that controls scan direction
        getPos = (_a1, _a2) => isHorizon ? rc2i(size, _a1, _a2) : rc2i(size, _a2, _a1);

    // Scan each square
    for (let a1 = 0; a1 < size; a1++) {
        let a2 = isPositive ? size - 1 : 0;
        while (0 <= a2 && a2 < size) {
            // Do moving for one square
            var pPos = getPos(a1, a2), // Original piece position
                piece = pieces.get(pPos);   // Original piece
            if (piece) {
                let pNum = piece.get('num'),     // Original square number
                    pNewA2 = a2 + step, // New axis two that the square will move to
                    existedPieceThere;            // Existing square in new position
                while (0 <= pNewA2 && pNewA2 < size &&
                (!(existedPieceThere = pieces.get(getPos(a1, pNewA2))) || (!(existedPieceThere instanceof List) && existedPieceThere.get('num') === pNum))) {
                    pNewA2 += step;
                }
                pNewA2 -= step;
                if (pNewA2 !== a2) {
                    var pNewPos = getPos(a1, pNewA2);
                    existedPieceThere = pieces.get(pNewPos);
                    pieces = pieces
                        .set(pPos, null)
                        .set(pNewPos, existedPieceThere ? List([existedPieceThere, piece]) : piece);
                    hasMoved = true;
                    hasDoubling = hasDoubling || !!existedPieceThere;
                }
            }

            // Increase to scan next square
            a2 += scanStep;
        }
    }

    const finalPieces = !hasDoubling ? pieces : pieces.map(piece => {
        if (piece && piece instanceof List) {
            __assert__(piece.size === 2 && immutable.Set(piece.map(p => p.get('num'))).size === 1); // 验证合并的两个棋子数字相等
            const newNum = piece.get(0).get('num') * 2;
            score += newNum;
            return getNewPiece(newNum, {doubled: true});
        } else {
            return piece;
        }
    });

    return {
        hasMoved,
        hasDoubling,
        score,
        pieces: finalPieces,
        movingPieces: pieces
    };
}

__TEST__ && (window.getMoveResult = getMoveResult);

/**随机生成新棋子
 * @return {Object.<pos, piece>} 索引为棋子位置*/
function randomPopNewPieces(pieces, size, count = 1) {
    const newPieces = {};
    const emptyPos = getEmptyPositions(pieces, size);
    count = count > emptyPos.length ? emptyPos.length : count;
    while (count > 0) {
        const idx = Math.floor(Math.random() * emptyPos.length);
        newPieces[emptyPos[idx]] = getNewPiece(2); // TODO: Math.random() < 0.9 ? 2 : 4;
        emptyPos.splice(idx, 1);
        count--;
    }
    return newPieces;
}

function putPieces(pieces, newPieceMap) {
    forEach(newPieceMap, (piece, pos) => {
        pieces = pieces.set(pos, piece);
    });
    return pieces;
}

export default class Game2048 extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        pieces: PropTypes.instanceOf(immutable.List).isRequired,
        score: PropTypes.number.isRequired
    };

    size = 4; // 2048 棋牌大小

    state = {
        flashingScore: false
    };

    /** 移动成功后放置新棋子的方法
     * @type {function.<pieces, size>}
     * @returns {{pos: <piece>}}. 默认函数返回一个随机位置的棋子 */
    popNewPieces = (pieces, size) => randomPopNewPieces(pieces, size, 1);

    configure({popNewPieces}) {
        this.popNewPieces = popNewPieces;
    }

    _moving = false;
    move(direction) {
        __TEST__ && (window.moves = (window.moves || []).concat([direction]));

        const {pieces, score, dispatch} = this.props;
        const {hasMoved, hasDoubling, movingPieces, pieces: finalPieces, score: finalScore} = getMoveResult({
            pieces, score, direction,
            size: this.size
        });

        if (hasMoved && !this._moving) {
            const newPieceMap = this.popNewPieces(movingPieces, this.size);

            __TEST__ && (window.newPieces = (window.newPieces || []).concat([mapValues(newPieceMap, p => p.toJS())]));

            dispatch(setPiecesAction(putPieces(movingPieces, newPieceMap)));

            if (hasDoubling) {
                this._moving = true;
                window.setTimeout(() => {
                    dispatch(setPiecesAction(putPieces(finalPieces, newPieceMap)));
                    dispatch(setScoreAction(finalScore));
                    this._moving = false;
                }, TransitionDuration);
            }
        }

        return hasMoved;
    }

    onDocumentKeyDown = (e) => {
        var direction = key2direction[e.keyCode];
        if (direction) {
            this.move(direction);
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.score !== this.props.score) {
            // 分数变化时, 闪烁分数
            clearTimeout(this._clearFlashingTimer);
            this.setState({flashingScore: true}, () => {
                this._clearFlashingTimer = setTimeout(() => this.setState({flashingScore: false}), 500);
            });
        }
    }

    componentDidMount() {
        const {pieces, dispatch} = this.props;
        dispatch(setPiecesAction(
            putPieces(pieces, randomPopNewPieces(pieces, this.size, 2))
        ));
    }

    render() {
        const {pieces, score} = this.props;
        const size = this.size;
        const getPieceStyle = pieceInfo => {
            const {row, col} = i2rc(size, pieceInfo.get('pos'));
            return {
                zIndex: pieceInfo.get('num') + (pieceInfo.get('innerIndex') || 0),
                top: row * pieceSize,
                left: col * pieceSize
            };
        };

        let orderedPieces = List();
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const pos = rc2i(size, i, j),
                    piece = pieces.get(pos);
                if (piece) {
                    if (piece instanceof List) {
                        orderedPieces = orderedPieces.concat(piece.map((p, idx) => p.set('pos', pos).set('innerIndex', idx)));
                    } else {
                        orderedPieces = orderedPieces.push(piece.set('pos', pos));
                    }
                }
            }
        }
        // 按固定uid顺序排序, 以保证react渲染时节点顺序保持不变 (否则会丢失动画效果)
        orderedPieces = orderedPieces.sortBy(p => p.get('uid'));

        return (
            <DocumentEvent onKeyDown={this.onDocumentKeyDown}>
                <div className="Game2048">
                    <div className="score">
                        score:
                        <span className={`score-num ${this.state.flashingScore ? 'flashing' : ''}`}>{score}</span>
                    </div>
                    <div className="game2048-content">
                        <div className="background-container">
                            {(new Array(size).fill(0)).map((v, idx) => (
                                <div key={idx} className="bg-pieces-row">
                                    {(new Array(size).fill(0)).map((v, idx) => <div key={idx} className="piece"></div>)}
                                </div>
                            ))}
                        </div>
                        <div className="pieces-container">
                            <ReactCSSTransitionGroup transitionName="piece" transitionAppear={false}
                                                     transitionEnterTimeout={AnimationEnterDuration} transitionLeaveTimeout={AnimationLeaveDuration}>
                                {orderedPieces.map(pInfo => (
                                    <div key={pInfo.get('uid')} style={getPieceStyle(pInfo)}
                                         className={`piece num${pInfo.get('num')} ${pInfo.get('doubled') && 'doubled' || ''}`}
                                         className={cn({'piece': true, [`num${pInfo.get('num')}`]: true, 'doubled': pInfo.get('doubled')})}>
                                        {pInfo.get('num')}
                                    </div>
                                ))}
                            </ReactCSSTransitionGroup>
                        </div>
                    </div>
                    <Game2048Player game2048={this}/>
                </div>
            </DocumentEvent>
        );
    }
}
