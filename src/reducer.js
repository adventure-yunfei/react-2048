import immutable from 'immutable';

import * as actions from './actions';

const defaultState = immutable.fromJS({
    /** 纪录当前2048棋牌中的棋子信息
     * @type {immutable.List.<{uid: string, num: int, pos: int, node: HTMLElement|undefined, action: string, doubling: boolean|undefined}>} */
    pieces: immutable.List(),
    /** 当前游戏分数 */
    score: 0
});

export default function reducer(state = defaultState, {type, payload}) {
    switch (type) {
        case actions.setPiecesAction:
            return state.set('pieces', payload);
        case actions.setScoreAction:
            return state.set('score', payload);
        default:
            return state;
    }
}
