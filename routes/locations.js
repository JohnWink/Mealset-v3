module.exports = app =>{
    const locations = require("../controllers/locations.js")

    app.get("/cities", locations.findAllCities)
}