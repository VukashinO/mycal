

import app from 'firebase/app';

import 'firebase/auth';


// config from firebase.

const config = {
    apiKey: "AIzaSyCm7za1LKT0poHLSotnKXDWpzauILmHnwY",
    authDomain: "my-fitness-app-81de2.firebaseapp.com",
    databaseURL: "https://my-fitness-app-81de2.firebaseio.com",
    projectId: "my-fitness-app-81de2",
    storageBucket: "my-fitness-app-81de2.appspot.com",
    messagingSenderId: "197047254867"
    
  };
  

  // Wrapper class, communication with Firebase authentication API.

  class Firebase {
  constructor(){
    app.initializeApp(config);
    this.auth = app.auth();
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
  this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
  this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();
  }
  
  
  export default Firebase;