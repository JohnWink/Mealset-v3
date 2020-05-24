module.exports = app =>{
    
    const dayMeal = require("../controllers/dayMeal.js") 
  
    app.get('/restaurants/:idRestaurant/dayMeals',dayMeal.findbyRestaurant)

    app.get('/dayMeals/:idDayMeal',dayMeal.findByDay)

    app.get('/plates/:idPlate/dayMeals', dayMeal.findByPlate)

    app.post('/plates/:idPlate/dayMeals/:idDayMeal', dayMeal.create)

    app.put('/plates/:idPlate/dayMeals/:idDayMeal',dayMeal.update)

    app.delete('/plates/:idPlate/dayMeals/:idDayMeal', dayMeal.delete)

    app.delete('/restaurants/:idRestaurant/dayMeals', dayMeal.deleteByRestaurant)

    app.delete('/plates/:idPlate/dayMeals',dayMeal.deleteByPlate)
}