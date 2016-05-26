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

DB.init().then(data => dataDisplay.innerHTML = data);

submit.addEventListener('click', () => DB.save(title.value, BPM(beats)));
refresher.addEventListener('click', () => beats = []);

counters.forEach(counter => counter.addEventListener('click', () => {
    let beat = new Date().getTime() / 1000;
    beats.push(beat);
    const bpm = BPM(beats);
    display.innerHTML = bpm;
    similarTracks.innerHTML = getBPMRange(bpm - 5, bpm + 5);
}));

function BPM (beatlist) {
    const count = beatlist.length - 1;
    const time  = beatlist[count] - beatlist[0];
    const tempo = count / time * 60;
    return parseFloat(tempo.toFixed(1));
}

function getBPMRange (start, end) {
    return DB.data.filter(v => start <= v && v <= end);
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
        save (title, bpm) {
            firebaseDB.ref('/' + title).set(bpm);
        },
        init () {
            return new Promise(resolve => {
                firebaseDB.ref('/').on('value', data => {
                    this.data = Immutable.Map(data.val());
                    resolve(JSON.stringify(this.data));
                });
            });
        }
    };
}
