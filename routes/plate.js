module.exports = app => {

    const plate = require("../controllers/plate.js")
    //const multer = require('multer')
    //const upload = multer()

    app.get('/plates', plate.getAll)

    app.get('/plates/:idPlate', plate.findById)

    app.put('/plates/:idPlate',plate.update)

    app.put('/plates/:idPlate/upload',plate.upload)

    app.post('/restaurants/:idRestaurant/plates', plate.create)

    app.delete("/plates/:idPlate", plate.delete);

    app.delete("/restaurants/:idRestaurant/plates", plate.deleteAll);
}


