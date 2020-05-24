module.exports = app =>{
    const locations = require("../controllers/locations.js")

    app.get("/locations", locations.findAll)
}