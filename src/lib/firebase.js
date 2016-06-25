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
    init(user) {
        return new Promise(resolve => {
            firebaseDB.ref('/' + user).on('value', data => {
                this.data = ascending(data.val());
                resolve(this.data);
            });
        });
    },
    save(user, title, bpm) {
        firebaseDB.ref('/' + user + '/' + title).set(bpm);
    },
    remove(user, title) {
        firebaseDB.ref('/' + user + '/' + title).remove();
    }
};
