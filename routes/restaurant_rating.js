module.exports = app => {
    const rating = require("../controllers/restaurant_rating.js")

    app.get('/restaurants/ratings', rating.getAll)

    app.get('/restaurants/:idRestaurant/users/:idUser/ratings', rating.findById);

    app.get('/restaurants/users/:idUser/ratings', rating.findByUser);

    app.get('/restaurants/:idRestaurant/ratings', rating.findByRestaurant)

    app.post('/restaurants/:idRestaurant/users/:idUser/ratings', rating.create)

    app.put('/restaurants/:idRestaurant/users/:idUser/ratings', rating.update)

    app.delete('/restaurants/:idRestaurant/users/:idUser/ratings', rating.delete);

    app.delete('/restaurants/users/:idUser/ratings', rating.deleteByUser);
}