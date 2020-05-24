module.exports = app =>{
    const composition = require("../controllers/composition.js")

    app.get('/plates/:idPlate/compositions', composition.getAll)

    app.get('/compositions/:idComposition', composition.findById)

    app.post('/plates/:idPlate/compositions', composition.create)

    app.put('/compositions/:idComposition', composition.update)

    app.delete('/compositions/:idComposition',composition.delete)

    app.delete('/plates/:idPlate/compositions/',composition.deleteAll)
}