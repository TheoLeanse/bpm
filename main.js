'use strict';

const DB = firebaseManager();
DB.init().then(data => {
    document.querySelector('#data').innerHTML = data;
});

let beats           = [];
const title         = document.querySelector('#title');
const display       = document.querySelector('#display');
const similarTracks = document.querySelector('#similar');

document.querySelector('#counter').addEventListener('click', clickHandler);
document.querySelector('#refresh').addEventListener('click', () => beats = []);
document.querySelector('#submit').addEventListener('click', saveHandler);

function clickHandler () {
    let beat = new Date().getTime() / 1000;
    beats.push(beat);
    const bpm = BPM(beats);
    display.innerHTML = bpm;
    similarTracks.innerHTML = getBPMRange(bpm - 5, bpm + 5);
}

function BPM (beatlist) {
    const count = beatlist.length - 1;
    const time = beatlist[count] - beatlist[0];
    const tempo = count / time * 60;
    return parseFloat(tempo.toFixed(1));
}

function saveHandler () {
    DB.save(title.value, BPM(beats));
}

function getBPMRange (start, end) {
    return DB.data.filter(v => start <= v && v <= end);
}

function firebaseManager () {
    const firebaseConfig = {
        apiKey: "AIzaSyBB6HN_A8AWdm7QaGAaXOMtsWH1cSSZFjs",
        authDomain: "beatlister.firebaseapp.com",
        databaseURL: "https://beatlister.firebaseio.com",
        storageBucket: "beatlister.appspot.com"
    };
    firebase.initializeApp(firebaseConfig);
    const firebaseDB = firebase.database();
    return {
        //data: undefined,
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
