//const path = require('path');
//const app =require('../views/server');
//const router = require('express').Router();


/* 
router.get('/',function(req,res){

})

*/

module.exports = app =>{

    const restaurants = require("../controllers/restaurant.js")

    app.get('/restaurants',restaurants.getAll)

    app.get('/restaurants/:idRestaurant', restaurants.findById)

    app.post('/restaurants', restaurants.create)

    app.put('/restaurants/:idRestaurant', restaurants.update)

    app.delete('/restaurants/:idRestaurant', restaurants.delete)

    
}
