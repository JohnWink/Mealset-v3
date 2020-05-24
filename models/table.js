const db = require("../db")

//Constructor

const Table = function (table){
    this.nome = table.name
    this.tamanho = table.size
    this.descrição = table.description
    this.fumadores = table.smoking
    this.esplanada = table.outside
    this.idRestaurante = table.idRestaurant
}

//Gets all tables from restaurant
Table.getAll = (idRestaurant,result) =>{
    db.con.query("SELECT * FROM Mesa WHERE idRestaurante = ? AND ativo = 1", idRestaurant,(err,res) =>{
        if(err){
            console.log("Error:", err)
            
            return result(err,null)
        }
        else if(!res[0]){
            return result({kind:"not_found"}, null)
        }else{
            return result(null, res)
        }
    })
}

Table.findById = (idTable,result) =>{
    db.con.query("SELECT * FROM Mesa WHERE idMesa = ? AND ativo = 1", idTable, (err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }else if(!res[0]){
            return result({kind:"not_found"},null)
        }else{
            return result(null,res[0])
        }
    })
}

Table.create = (newTable, result)=>{

    db.con.query("INSERT INTO Mesa SET ?", newTable,(err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }
        else{
            return result(null,"Mesa Criada")
        }
    })
}

Table.update = (idTable,newTable,result)=>{
 db.con.query("UPDATE Mesa SET nome = ?, tamanho = ?, descrição = ?, fumadores = ?, esplanada = ? WHERE idMesa = ? AND ativo = 1", 
 [newTable.nome,newTable.tamanho,newTable.descrição,newTable.fumadores, newTable.esplanada, idTable],
 (err,res)=>{
     if(err){
         console.log("Error:",err)
         return result(err,null)
     }
     else if(res.affectedRows == 0){
         return result({kind:"not_found"}, null)
     }
     else{
         return result(null,"Mesa Atualizada")
     }
 })
}

Table.delete = (idTable,result)=>{
    db.con.query("UPDATE Mesa SET ativo = 0 WHERE idMesa = ? AND ativo = 1", idTable,(err,res)=>{
        if(err){
            console.log("Error:",err)
            return result(err,null)
        }
        else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,"Mesa Removida")
        }
    })
}

Table.deleteAll = (idRestaurant,result)=>{
    db.con.query("UPDATE Mesa SET ativo = 0 WHERE idRestaurante = ? AND ativo = 1", idRestaurant,(err,res)=>{
        if(err){
            console.log("Error:",err)
            return result(err,null)
        }
        else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,"Mesa Removida")
        }
    })
}


module.exports = Table