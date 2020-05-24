const mysql = require("mysql");



module.exports={
    mysql,
    con: mysql.createConnection({
        host:"remotemysql.com",
        user: "jkQxXAT7W2",
        password: "ZISQaeItma",
        database: `jkQxXAT7W2`
    })
} 
