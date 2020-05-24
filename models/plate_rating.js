const db = require("../db")

const Rating = function(rating) {
    this.estrelas = rating.value
}

Rating.findById = (idPlate,idUser,result)=>{
    
    db.con.query("SELECT * FROM Prato_Rating WHERE idPrato = ? AND idCliente = ? AND ativo = 1",[idPlate,idUser],(err,res)=>{
        if(err){
            
            console.log("Error:", err)
            return result(err,null)
        }else if(!res[0]){
           return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

Rating.findByPlate = (idPlate,result) =>{
    db.con.query("SELECT * FROM Prato_Rating WHERE idPrato = ? AND ativo = 1",idPlate,(err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }else if(!res[0]){
           return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}

Rating.findByUser = (idUser,result) =>{
    db.con.query("SELECT * FROM Prato_Rating WHERE idCliente = ? AND ativo = 1", idUser,(err,res)=>{
        if(err){
            console.log("Error:", err)
           return result(err,null)
        }else if(!res[0]){
           return result({kind:"not_found"},null)
        }
        else{
           return result(null,res)
        }
    })
}


Rating.create = (idPlate,idUser,value,result) =>{
 
            db.con.query("INSERT INTO Prato_Rating SET idPrato = ?, idCliente = ?, estrelas = ?",
            [idPlate,idUser,value], (err,res)=>{

                if(err){
                    console.log("Error:", err)
                    return result(err,null)
                }
              
                else{
                    return result(null,res)
                }
            })
       
}

Rating.update = (idPlate,idUser,value,result) =>{
    db.con.query("UPDATE Prato_Rating SET estrelas = ? WHERE idPrato = ? AND idCliente = ? AND ativo=1",
    [value,idPlate,idUser], (err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,res)
        }
    })
}


Rating.delete = (idPlate,idUser,result) =>{

    db.con.query("UPDATE Prato_Rating SET ativo = 0 WHERE idPrato = ? AND idCliente = ? AND ativo=1",
    [idPlate,idUser], (err,res)=>{

        if(err){

            console.log("Error:", err)
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


Rating.deleteByUser = (idUser,result) =>{

    db.con.query("UPDATE Prato_Rating SET ativo = 0 WHERE idCliente = ? AND ativo=1",
    idUser, (err,res)=>{

        if(err){

            console.log("Error:", err)
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


module.exports = Rating



