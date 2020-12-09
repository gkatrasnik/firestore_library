
var app_firebase = {}
  // Your web app's Firebase configuration
  
      
   
    /* */ var firebaseConfig = {
        apiKey: "AIzaSyCn_q9GCnOBTbQlk1pmlKh-4fV74D6ZqPI",
        authDomain: "library-e4c9c.firebaseapp.com",
        projectId: "library-e4c9c",
        storageBucket: "library-e4c9c.appspot.com",
        messagingSenderId: "604162653511",
        appId: "1:604162653511:web:90a497ae68262f68afe062",
        measurementId: "G-89ZYZ90GNZ"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    
    const db = firebase.firestore();
    db.settings({timestampsInSnapshots: true});

    app_firebase = firebase;
  
     
 
