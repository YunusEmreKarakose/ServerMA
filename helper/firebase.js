// Import Admin SDK
var admin = require("firebase-admin");

// Fetch the service account key JSON file contents
var serviceAccount = require("./service_account.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://deneme-55695.firebaseio.com"
});

module.exports = {
  // update db.rx with incoming data continuous
  write: function(data) {          
    var db = admin.database();
    var ref = db.ref("db");
    var usersRef = ref.child("rx");
    usersRef.set(data);
    console.log("wdb ok\n");
    }
};