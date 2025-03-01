// firebaseConfig.js
const admin = require("firebase-admin");
const serviceAccount = require("./sharelink.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sharelink-2bd8b.firebasestorage.app",
});

const bucket = admin.storage().bucket();
module.exports = { bucket };
