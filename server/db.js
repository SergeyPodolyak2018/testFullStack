const admin = require("firebase-admin");
const serviceAccount = require("./keys/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://podolyak-test-default-rtdb.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
const db = admin.database();


class DB {
  constructor() {
    this.db = db;
  }

  static getUser(login) {
    return new Promise(resolve => {
      const ref = db.ref(`/users/${login}`);
      ref.once("value", function(snapshot) {
        resolve(snapshot.val());
      });
    })
  }
}

module.exports = DB;
