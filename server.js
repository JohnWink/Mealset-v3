var express = require("express");
//var expressSanitized = require("express-sanitize-escape")
var bodyParser = require("body-parser");
//var admin = require('firebase-admin');
//var serviceAccount = require("./mealset-1579630397236-firebase-adminsdk-qcgpv-dd5a66335d.json")
//const {Storage} = require('@google-cloud/storage');
//var session = require('express-session')
const db = require("./db");



/*
// The Firebase Admin SDK to access Cloud Firestore.
const firebaseAdmin = require('firebase-admin');



function getAppInDeployedFunctions() {
  const functions = require('firebase-functions');
  firebaseAdmin.initializeApp(functions.config().firebase);
}

getAppInDeployedFunctions()

 */   


var app = express();




app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//app.use(expressSanitized.middleware());

/*
// Creates a client
const storage = new Storage({keyFilename:"MealSet-b6ea8bc5fbe6.json"});
// Creates a client from a Google service account key.
// const storage = new Storage({keyFilename: "key.json"});

const bucketName = 'notifications';

async function createBucket() {
  // Creates the new bucket
  await storage.createBucket(bucketName);
  console.log(`Bucket ${bucketName} created.`);
}

createBucket().catch(console.error);


//expressSanitized.sanitizeParams(app,['idRestaurant', 'idPlate','idTable', 'idComposition'])

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://mealset-1579630397236.firebaseio.com"
  });

  */



module.exports= app;


require("./routes/restaurant.js")(app)
require("./routes/plate.js")(app)
require("./routes/table.js")(app)
require("./routes/ingredient.js")(app)
require("./routes/composition.js")(app)
require("./routes/restaurant_rating.js")(app)
require("./routes/reservation")(app)
require("./routes/plate_rating.js")(app)
require("./routes/dayMeal.js")(app)
require("./routes/user.js")(app)


/*
// For Passport
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  })); // session secret
  app.use(passport.initialize());
  app.use(passport.session()); // persistentlogin sessions


  app.post('/login',
  passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true })
  );
*/


app.listen(3000,function(){
    console.log("Server running at http://127.0.0:3000/")
})



