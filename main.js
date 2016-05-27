'use strict';
let beats           = [];
const DB            = firebaseManager();
const title         = document.querySelector('#title');
const submit        = document.querySelector('#submit');
const display       = document.querySelector('#display');
const counters      = Array.from(document.querySelectorAll('.counter'));
const refresher     = document.querySelector('#refresh');
const dataDisplay   = document.querySelector('#data');
const similarTracks = document.querySelector('#similar');

DB.init().then(data => dataDisplay.innerHTML = ObjToUL(data));

submit.addEventListener('click', () => DB.save(title.value, BPM(beats)));

counters.forEach(counter => counter.addEventListener('click', () => {
    const beat = new Date().getTime() / 1000;
    beats.push(beat);

    const bpm = BPM(beats);
    display.innerHTML = bpm ? bpm : '...';

    const similar = range(DB.data, bpm - 5, bpm + 5);
    similarTracks.innerHTML = ObjToUL(similar);
}));

[submit, refresher]
    .forEach(el => el.addEventListener('click', reset));

function BPM (beatlist) {
    const count = beatlist.length - 1;
    const time  = beatlist[count] - beatlist[0];
    return parseInt(count / time * 60);
}

function reset () {
    beats = [];
    display.innerHTML = similarTracks.innerHTML = 'Click to begin';
}

function ObjToUL (object) {
    return JSON.stringify(object)
        .replace(/{/g, '<ul><li>')
        .replace(/,/g, '</li><li>')
        .replace(/}/g, '</li></ul>');
}

function ascending (input) {
    let output = {};
    Object.keys(input)
        .sort((a, b) => input[a] - input[b])
        .forEach(key => output[key] = input[key]);
    return output;
}

function range (data, start, end) {
    let output = {};
    Object.keys(data)
        .filter(key => start <= data[key] && data[key] <= end)
        .forEach(key => output[key] = data[key]);
    return output;
}

function firebaseManager () {
    const firebaseConfig = {
        apiKey:        "AIzaSyBB6HN_A8AWdm7QaGAaXOMtsWH1cSSZFjs",
        authDomain:    "beatlister.firebaseapp.com",
        databaseURL:   "https://beatlister.firebaseio.com",
        storageBucket: "beatlister.appspot.com"
    };
    firebase.initializeApp(firebaseConfig);
    const firebaseDB = firebase.database();
    return {
        init () {
            return new Promise(resolve => {
                firebaseDB.ref('/').on('value', data => {
                    this.data = ascending(data.val());
                    resolve(this.data);
                });
            });
        },
        save (title, bpm) {
            firebaseDB.ref('/' + title).set(bpm);
        }
    };
}
