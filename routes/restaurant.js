//const path = require('path');
//const app =require('../views/server');
//const router = require('express').Router();


/* 
router.get('/',function(req,res){

})

*/

module.exports = app =>{

    const restaurants = require("../controllers/restaurant.js")
    const multer = require('multer')
    //const upload = multer({dest:'../public/uploads/'})

    app.get('/restaurants',restaurants.getAll)

    app.get('/restaurants/:idRestaurant', restaurants.findById)

    app.post('/restaurants', restaurants.create)

    app.put('/restaurants/:idRestaurant', restaurants.update)

    app.put('/restaurants/:idRestaurant/upload',restaurants.upload)

    app.put('/restaurants/:idRestaurant/uploadCover',restaurants.uploadCover)

    app.put('/restaurants/:idRestaurant/uploadLogo', restaurants.uploadLogo)

    app.delete('/restaurants/:idRestaurant', restaurants.delete)

    app.put('/restaurants/:idRestaurant/linkUpload',restaurants.linkUpload)

    
}
