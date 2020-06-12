const mysql = require("mysql");



module.exports={
    mysql,
    con: mysql.createConnection({
        host:"db4free.net",
        user: "johnwink",
        password: "ZISQaeItma",
        database: `mealset`
    })
} 
