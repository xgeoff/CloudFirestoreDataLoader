/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var db;

function init() {
    db = firebase.firestore();
}
function createSubcollection(doc, collectionname, values) {
    var element = document.getElementById("alert");

   element.innerHTML = "Creating Subcollection: " + collectionname;
    var collection = doc.collection(collectionname);

    for (var prop in values) {
        addDocument(collection, prop, values[prop]);
    }
}
function addDocument(collection, name, values) {
    // checking to see if the document values are simple or complex
    var element = document.getElementById("alert");
    var value = null;
    
    if (values !== null) {
        value = Object.values(values)[0];
    }
    
    
    if (value === null) {
        // do nothing
    } else if (typeof value === 'object') {
        // we have a complex object, does this go one level deeper?
        
        value = Object.values(value)[0];
        
        if (value === null) {
            // do nothing
        } else if (typeof value === 'object') {
            // We have two levels of objects
            // so we create subcollection
            element.innerHTML = "Creating Document " + name;
            var doc = collection.doc(name);
            for (var prop in values) {
                
                createSubcollection(doc, prop, values[prop]);
            }
        } else {
            //create doc
            element.innerHTML = "Creating Document " + name;
            collection.doc(name).set(values)
            .catch(function(error) {
                console.error("Error writing document: ", error);
                element.style.color = red;

                element.innerHTML = "Error: " + error;
            });;
        }
    } else {
        element.innerHTML = "Creating Document " + name;
        collection.doc(name).set(values)
        .catch(function(error) {
            element.style.color = red;

            element.innerHTML = "Error: " + error;
        });;
    }
}
function createCollection(name, values) {
    var element = document.getElementById("alert");

    var collection = db.collection(name);
    
    for (var prop in values) {
        element.innerHTML = "Creating Document " + prop + " in Collection " + name;
        addDocument(collection, prop, values[prop]);
    }
}
function loadData() {
    var element = document.getElementById("alert");
    element.style.color = 'green';
    element.style.backgroundColor = 'lightyellow';
    element.innerHTML = "Loading...";
    var content = document.getElementById('datainput').value;
    
    var obj = JSON.parse(content);
    var prop;
    for (prop in obj) {
        element.innerHTML = "Creating Collection: " + prop;

        createCollection(prop, obj[prop]);
    }
}
function clearData() {
    document.getElementById('datainput').value="";
}
function setLoader(responsetext) {
    document.getElementById("main").innerHTML = responsetext;
}
function getHtml(url, callback) {
    var xmlhttp;
        
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.onreadystatechange = function() {

        if (xmlhttp.readyState===4 && xmlhttp.status===200) {
            var responseText = xmlhttp.responseText;

            callback(responseText);
        }
    };
    xmlhttp.open("GET",url,true);
    xmlhttp.send();
}
// Initialize Firebase
  var config = {
    apiKey: "put your api key in here",
    authDomain: "yourappname.firebaseapp.com",
    databaseURL: "https://yourappname.firebaseio.com",
    projectId: "yourprojectid",
    storageBucket: "yourappname.appspot.com",
    messagingSenderId: "yourmessagesenderid"
  };
  firebase.initializeApp(config);
  
  var uiConfig = {
    callbacks: {
        signInSuccess: function (currentUser, credential, redirectUrl) {
            init();
            getHtml('htm/loader.html', setLoader);
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,
    // Query parameter name for mode.
    queryParameterForWidgetMode: 'mode',
    // Query parameter name for sign in success url.
    queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    //signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

