'use strict';
let beats = [];

const  firebaseConfig = {
    apiKey: "AIzaSyBB6HN_A8AWdm7QaGAaXOMtsWH1cSSZFjs",
    authDomain: "beatlister.firebaseapp.com",
    databaseURL: "https://beatlister.firebaseio.com",
    storageBucket: "beatlister.appspot.com"
};
firebase.initializeApp(firebaseConfig);
const firebaseDB = firebase.database();
const DB = {
    data: undefined,
    save(title, bpm) {
        firebaseDB.ref('/' + title).set(bpm);
    },
    init() {
        firebaseDB.ref('/').on('value', data => {
            this.data = Immutable.Map(data.val());
            document.getElementById('data').innerHTML = JSON.stringify(this.data);
        });
    }
};

DB.init();

function getBPMRange(start, end) {
    return DB.data.filter(v => start <= v && v <= end);
}

const title = document.querySelector('#title');

document.querySelector('#counter').addEventListener('click', clickHandler);

document.querySelector('#refresh').addEventListener('click', () => beats = []);

document.querySelector('#submit').addEventListener('click', saveHandler);

document.querySelector('#range').addEventListener('click', () => console.log(DB.data, getBPMRange(100, 500)));

const similarTracks = document.querySelector('#similar');

function clickHandler() {
    let beat = new Date().getTime() / 1000;
    beats.push(beat);
    const bpm = BPM(beats);
    this.innerHTML = bpm;
    similarTracks.innerHTML = getBPMRange(bpm - 5, bpm + 5);
}

function BPM(beatlist) {
    const count = beatlist.length - 1;
    const time = beatlist[count] - beatlist[0];
    return count / time * 60;
}

function saveHandler() {
    DB.save(title.value, BPM(beats));
}
