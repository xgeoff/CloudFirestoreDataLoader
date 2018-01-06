# CloudFirestoreDataLoader
Simple HTML project to load json data into Google Cloud Firestore

Go into dataloader.js and look for the following lines:

// Initialize Firebase
  var config = {
    apiKey: "put your api key in here",
    authDomain: "yourappname.firebaseapp.com",
    databaseURL: "https://yourappname.firebaseio.com",
    projectId: "yourprojectid",
    storageBucket: "yourappname.appspot.com",
    messagingSenderId: "yourmessagesenderid"
  };
  
  Change these settings to match your project settings. Then serve this up from a webserver and paste your json export from the Google Realtime DB (or just your regular json file) and click on the load button.
  
  There is very little error handling at this point, Please use this at your own risk!
