import React from 'react';
import ReactDOM from 'react-dom';
import DB from './lib/firebase';

const edit          = document.querySelector('#edit');
const user          = document.querySelector('#user');
const title         = document.querySelector('#title');
const submit        = document.querySelector('#titleform');
const remove        = document.querySelector('.jsRemove');
const display       = document.querySelector('#display');
const counters      = Array.from(document.querySelectorAll('.counter'));
const refresher     = document.querySelector('#refresh');
const dataDisplay   = document.querySelector('#data');
const similarTracks = document.querySelector('#similar');

let beats = [];

// handle multiple users
user.addEventListener('change', () => {
    DB.init(user.value).then(data => dataDisplay.innerHTML = ObjToUL(data));
    document.cookie = 'bpmuser=' + user.value;
});

if (readCookie('bpmuser')) user.value = readCookie('bpmuser');

function readCookie (name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

const App = React.createClass({
    render() {
        return <p>y</p>;
    }
});

ReactDOM.render(<App />, document.querySelector('.app'));

DB.init(user.value).then(data => dataDisplay.innerHTML = ObjToUL(data));

counters.forEach(counter => counter.addEventListener('click', () => {
    const beat = new Date().getTime() / 1000;
    beats.push(beat);

    const bpm = BPM(beats);
    display.innerHTML = bpm ? bpm : '';

    const similar = range(DB.data, bpm - 5, bpm + 5);
    similarTracks.innerHTML = ObjToUL(similar);
}));

submit.addEventListener('submit', e => {
    e.preventDefault();
    if (title.value) DB.save(user.value, title.value, BPM(beats));
    reset();
});

remove.addEventListener('click', e => {
    if (!edit.checked) return;
    const trackTitle = /"(.+)"/.exec(e.target.innerHTML)[1];
    if (confirm('sure you want to delete ' + trackTitle + '?')) {
        DB.remove(user.value, trackTitle);
        reset();
    }
});

refresher.addEventListener('click', reset);

function BPM (beatlist) {
    const count = beatlist.length - 1;
    const time  = beatlist[count] - beatlist[0];
    return parseInt(count / time * 60);
}

function reset () {
    beats = [];
    display.innerHTML = '';
    similarTracks.innerHTML = '<ul><li>...</li></ul>';
    title.value = '';
    dataDisplay.innerHTML = ObjToUL(DB.data);
}

function ObjToUL (object) {
    return JSON.stringify(object)
        .replace(/{/g, '<ul><li>')
        .replace(/,/g, '</li><li>')
        .replace(/}/g, '</li></ul>');
}

function range (input, start, end) {
    return Object.keys(input)
        .filter(key => start <= input[key] && input[key] <= end)
        .reduce((output, key) => {
            output[key] = input[key];
            return output;
        }, {});
}
