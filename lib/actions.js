"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var setPiecesAction = function setPiecesAction(pieces) {
    return {
        type: setPiecesAction,
        payload: pieces
    };
};

exports.setPiecesAction = setPiecesAction;
var setScoreAction = function setScoreAction(score) {
    return {
        type: setScoreAction,
        payload: score
    };
};
exports.setScoreAction = setScoreAction;