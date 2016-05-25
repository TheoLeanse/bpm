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
            this.data = JSON.stringify(data.val());
            document.getElementById('data').innerHTML = this.data;
        });
    }
};

DB.init();

function getBPMRange(start, end) {
    // return tracks within bpm range
    const dataMap = Immutable.Map(DB.data);
    return dataMap.filter(x => start <= x && x <= end);
}

const title = document.querySelector('#title');

document.querySelector('#counter').addEventListener('click', clickHandler);

document.querySelector('#refresh').addEventListener('click', () => beats = []);

document.querySelector('#submit').addEventListener('click', saveHandler);

document.querySelector('#range').addEventListener('click', () => console.log(getBPMRange(100, 500)));

function clickHandler() {
    let beat = new Date().getTime() / 1000;
    beats.push(beat);
    this.innerHTML = BPM(beats);
}

function BPM(beatlist) {
    const count = beatlist.length - 1;
    const time = beatlist[count] - beatlist[0];
    return count / time * 60;
}

function saveHandler() {
    DB.save(title.value, BPM(beats));
}
