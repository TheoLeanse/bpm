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
    save(title, bpm) {
        firebaseDB.ref('/' + title).set(bpm);
    },
    init() {
        firebaseDB.ref('/').on('value', data => {
            document.getElementById('data').innerHTML = JSON.stringify(data.val());
        });
    }
};
DB.init();

function getBPMRange(start, end) {
    // return tracks within bpm range

}

const title = document.querySelector('#title');

document.querySelector('#counter').addEventListener('click', clickHandler);

document.querySelector('#refresh').addEventListener('click', () => beats = []);

document.querySelector('#submit').addEventListener('click', saveHandler);

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
