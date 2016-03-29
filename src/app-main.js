import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {connect, Provider} from 'react-redux';

import reducer from './reducer';
import Game2048 from './Game2048';

const store = createStore(reducer);

const ConnectedGame2048 = connect((state) => ({
    pieces: state.get('pieces'),
    score: state.get('score')
}))(Game2048);

render((
    <Provider store={store}>
        <ConnectedGame2048/>
    </Provider>
), document.getElementById('app'));
