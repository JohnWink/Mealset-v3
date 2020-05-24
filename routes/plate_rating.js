module.exports = app =>{
    const rating = require("../controllers/plate_rating.js");

    app.get ('/plates/:idPlate/users/:idUser/ratings',rating.findById);

    app.get('/plates/:idPlate/ratings',rating.findByPlate);

    app.get('/plates/users/:idUser/ratings', rating.findByUser);

    app.post('/plates/:idPlate/users/:idUser/ratings', rating.create);

    app.put('/plates/:idPlate/users/:idUser/ratings', rating.update);

    app.delete('/plates/:idPlate/users/:idUser/ratings', rating.delete);

    app.delete('/plates/users/:idUser/ratings', rating.deleteByUser);
}