
import * as firebase from "firebase";

import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpz2F8QYgE4nFBf2GwBHVmfRktib8DFIc",
  authDomain: "signal-clone-2f675.firebaseapp.com",
  projectId: "signal-clone-2f675",
  storageBucket: "signal-clone-2f675.appspot.com",
  messagingSenderId: "273007412901",
  appId: "1:273007412901:web:6d3b524ecc73770a092f4c"
};

// we don't want to keep initializing 'app', this is we don't need to...
let app;
if(firebase.apps.length === 0) {
  app =  firebase.initializeApp(firebaseConfig);
}else{
  app = firebase.app();
}

// create a database accessing variable 'db'
const db = app.firestore();
// firebase authentification
const auth = firebase.auth();

// this means we now can access these variables
// this means now we all access to firebase variables
// one file connects everything where we need 
export { db, auth };