"use strict";
var GAUGE_MAX = 329;
function setGaugePercent($node, percent) {
    var $gaugeCircle = $node.querySelector('.gauge__cirlce-arc');
    var $gaugePercent = $node.querySelector('.gauge__percent_value');
    var value = GAUGE_MAX * (percent / 100);
    $gaugeCircle.setAttribute('stroke-dasharray', value + " " + GAUGE_MAX);
    $gaugePercent.innerText = percent.toString();
}
function saveState(state) {
    localStorage.setItem('todayAppState', JSON.stringify(state));
}
function getStoredStateOrDefault(defaultState) {
    var stateAsStr = localStorage.getItem('todayAppState');
    if (stateAsStr) {
        return JSON.parse(stateAsStr);
    }
    else {
        return defaultState;
    }
}
function createDiv(styles, content, treatAsHtml) {
    if (styles === void 0) { styles = []; }
    if (content === void 0) { content = ""; }
    if (treatAsHtml === void 0) { treatAsHtml = false; }
    var div = document.createElement('div');
    for (var _i = 0, styles_1 = styles; _i < styles_1.length; _i++) {
        var style = styles_1[_i];
        div.classList.add(style);
    }
    if (typeof (content) === 'string') {
        if (treatAsHtml)
            div.innerHTML = content;
        else
            div.innerText = content;
    }
    else {
        for (var _a = 0, content_1 = content; _a < content_1.length; _a++) {
            var child = content_1[_a];
            div.appendChild(child);
        }
    }
    return div;
}
