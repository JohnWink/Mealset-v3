const db = require("../db")

const DayMeal = function (dayMeal){
    this.Dia = dayMeal.idDayMeal
    this.idPrato = dayMeal.idPlate
}

DayMeal.findById = (idDayMeal,idPlate,result) =>{
    db.con.query("SELECT * FROM Menu_do_Dia WHERE Dia = ? AND idPrato = ?",
    [idDayMeal,idPlate],(err,res)=>{
        if(err){
            console.log("Error", err)
            return result(err,null)
        }
        else if(!res[0]){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.findByRestaurant = (idRestaurant,result) =>{
    db.con.query("SELECT Menu_do_Dia.Dia, Prato.* FROM Menu_do_Dia INNER JOIN Prato ON Menu_do_Dia.idPrato = Prato.idPrato WHERE Prato.idRestaurante = ? AND Prato.ativo = 1",
    idRestaurant,(err,res)=>{
        if(err){
            console.log("Error", err)
            return result(err,null)
        }
        else if(!res[0]){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.findByDay = (idDayMeal,result) =>{
    db.con.query("SELECT Menu_do_Dia.Dia, Prato.* FROM Menu_do_Dia INNER JOIN Prato ON Menu_do_Dia.idPrato = Prato.idPrato WHERE Menu_do_Dia.Dia = ? AND Prato.ativo = 1",
    idDayMeal,(err,res)=>{
        if(err){
            console.log("Error", err)
            return result(err,null)
        }
        else if(!res[0]){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.findByPlate = (idPlate,result) =>{
    db.con.query("SELECT Menu_do_Dia.Dia, Prato.* FROM Menu_do_Dia INNER JOIN Prato ON Menu_do_Dia.idPrato = Prato.idPrato WHERE Prato.idPrato = ? AND Prato.ativo = 1",
    idPlate,(err,res)=>{
        if(err){
            console.log("Error", err)
            return result(err,null)
        }
        else if(!res[0]){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.create = (idDayMeal,idPlate,result) =>{
    db.con.query("INSERT INTO Menu_do_Dia SET dia= ? , idPrato = ?",
    [idDayMeal,idPlate],(err,res)=>{
        if(err){
            console.log("Error", err)
            return result(err,null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.update = (idDayMeal,idPlate,result) =>{

    db.con.query("UPDATE Menu_do_Dia SET idPrato = ? WHERE Dia = ?",
    [idPlate,idDayMeal],(err,res)=>{

        if(err){
            console.log("Error", err)
            return result(err,null)

        }
        else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.delete = (idDayMeal,idPlate,result) =>{

    db.con.query("DELETE FROM Menu_do_Dia WHERE Dia = ? AND idPrato = ?",
    [idDayMeal,idPlate],(err,res)=>{

        if(err){
            console.log("Error", err)
            return result(err,null)

        }
        else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.deleteByRestaurant = (idRestaurant,result) =>{
    db.con.query("DELETE Menu_do_Dia FROM Menu_do_Dia JOIN Prato ON Menu_do_Dia.idPrato = Prato.idPrato WHERE Prato.idRestaurante = ?",
    [idRestaurant],(err,res)=>{

        if(err){
            console.log("Error", err)
            return result(err,null)

        }
        else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

DayMeal.deleteByPlate = (idPlate,result) =>{
    db.con.query("DELETE FROM Menu_do_Dia WHERE  idPrato = ?",
    idPlate,(err,res)=>{

        if(err){
            console.log("Error", err)
            return result(err,null)

        }
        else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}



module.exports = DayMeal

