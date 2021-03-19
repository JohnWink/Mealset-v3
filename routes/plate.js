module.exports = app => {

    const plate = require("../controllers/plate.js")
    //const multer = require('multer')
    //const upload = multer()

    app.get('/plates', plate.getAll)

    app.get('/plates/:idPlate', plate.findById)

    app.get('/restaurants/:idRestaurant/plates' , plate.findByRestaurant)

    app.put('/plates/:idPlate',plate.update)

    app.put('/plates/:idPlate/upload',plate.upload)

    app.put('/plates/:idPlate/linkUpload',plate.linkUpload)

    app.post('/restaurants/:idRestaurant/plates', plate.create)

    app.delete("/plates/:idPlate", plate.delete);

    app.delete("/restaurants/:idRestaurant/plates", plate.deleteAll);
}


