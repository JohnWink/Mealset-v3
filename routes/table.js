module.exports = app =>{
    const tables = require("../controllers/table.js")

    app.get("/restaurants/:idRestaurant/tables",tables.getAll)

    app.get("/tables/:idTable",tables.findById)

    app.post("/restaurants/:idRestaurant/tables", tables.create)

    app.put("/tables/:idTable",tables.update)

    app.delete("/tables/:idTable", tables.delete)

    app.delete("/restaurants/:idRestaurant/tables", tables.deleteAll)
}
