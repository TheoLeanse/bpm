import firebase from 'firebase';
import ascending from './ascending';

const firebaseConfig = {
    apiKey:        "AIzaSyBB6HN_A8AWdm7QaGAaXOMtsWH1cSSZFjs",
    authDomain:    "beatlister.firebaseapp.com",
    databaseURL:   "https://beatlister.firebaseio.com",
    storageBucket: "beatlister.appspot.com"
};

firebase.initializeApp(firebaseConfig);

const firebaseDB = firebase.database();

export default {
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
    },
    remove(title) {
        firebaseDB.ref('/' + title).remove();
    }
};
