module.exports = app =>{
    const ingredient = require("../controllers/ingredient.js")

    app.get('/ingredients', ingredient.getAll)

    app.get('/ingredients/:idIngredient', ingredient.findById)

    app.put('/ingredients/:idIngredient',ingredient.update)

    app.post('/ingredients/', ingredient.create)

    app.delete("/ingredients/:idIngredient", ingredient.delete);

}