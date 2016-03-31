# 2048 game implemented by React

# Run it on your own:

### - Run as standalone, very simple!

1. Clone project
2. Open `lib/app-main.html` in browser

Tha's it! Actually you only need three files: `bundles/app-main.js`, `bundles/app-main.css`, and `lib/app-main.html` which loads previous two.

### - Include in another project as package

1. In your own project, install it as package dependency by `npm install git+ssh://git@github.com:adventure-yunfei/react-2048.git --save`
2. react-2048 uses [redux](https://github.com/reactjs/redux/) flow with [immutable](https://github.com/facebook/immutable-js/) store, so include its redux reducer and connect props to it:

```javascript
// in root reducer.js (here we put it on root reducer but you can put it anywhere, as long as you later "connect" proper state part to React2048 component)
import {combineReducer} from 'redux';
import {reducer as game2048}
export default combineReducer({
    game2048,
    ... // your other reducer
});

// in rendering component file
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import React2048 from 'react-2048';
const ConnectedReact2048 = connect(state => ({
    // react-2048 uses immutable state, change the code to correctly access state if you use another one on top level
    pieces: state.getIn(['game2048', 'pieces']),
    score: state.getIn(['game2048', 'score'])
}))(React2048)

ReactDOM.render(ConnectedReact2048, containerNode);

```