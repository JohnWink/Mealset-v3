module.exports = app =>{

    const notification = require("../controllers/notification.js")

    app.get("/users/:idUser/notifications", notification.getByUser)

    app.get("/restaurants/:idRestaurant/notifications", notification.getByRestaurant)

    app.put("/notifications/:idNotification", notification.update)

    app.put("restaurants/:idRestaurant/notifications/read", notification.readByRestaurant)

    app.put("users/:idUser/notifications/read", notification.readByUser)

    app.post("/restaurants/:idRestaurant/users/:idUser/notifications", notification.create)

    
}