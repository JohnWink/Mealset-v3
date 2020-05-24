const db = require("../db")

const Ingredient = function(ingredient){
    this.nome = ingredient.name
};

Ingredient.getAll = result =>{
    db.con.query("SELECT * FROM Ingredientes WHERE ativo = 1;",(err,res)=>{
        if(err){
            console.log("Error:", err)
            result(err,null)
        }else if(!res[0]){
            result({kind:"not_found"},null)
        }
        else{
            result(null,res)
        }
    })
}

Ingredient.findById = (idIngredient,result) =>{
    db.con.query("SELECT * FROM Ingredientes WHERE nome = ? AND ativo = 1;", idIngredient,(err,res)=>{
        if(err){
            console.log("Error:",err)
            result(err,null)
        }
        else if(!res[0]){
            result({kind:"not_found"}, null)
        }
        else{
            result(null,res)
        }
    })
}

Ingredient.update =(idIngredient, newId, result) =>{
    //Looking if there's any deleted that already exists
    db.con.query("SELECT * FROM Ingredientes WHERE nome = ? AND ativo = 0",newId,(err,res)=>{
        if(err){
            console.log("Error:", err)
            result(err,null)
        }
        else if(!res[0]){
            //Updates an aleady existing ingredient with the new name
            db.con.query("UPDATE Ingredientes SET nome = ? WHERE nome = ? AND ativo = 1;",[newId, idIngredient],(err,res)=>{
                if(err){
                    console.log("Error:",err)
                    result(err,null)
                }
                else if(res.affectedRows == 0){
                    result({kind:"not_found"},null)
                }
                else{
                    result(null,"Atualizado com sucesso")
                }
            })
        }
        else{
            //Recycles the deleted Ingredient
            db.con.query("UPDATE Ingredientes SET ativo = 1 WHERE nome = ?", newId,(err,res)=>{
                if(err){
                    console.log("Error:",err)
                    result(err,null)
                }
                else if(res.affectedRows == 0){
                    result({kind:"not_found"},null)
                }
                else{
                    result(null,"Atualizado com sucesso")
                }
                
            })
        }
    })
 
}

Ingredient.create =(newIngredient,result)=>{
    db.con.query("INSERT INTO Ingredientes SET nome = ?;", newIngredient, (err,res)=>{
        if(err){
            console.log("Error:", err)
            result(err,null)
        }
        else{
            result(null,"Criado com sucesso")
        }
    })
}

Ingredient.delete = (idIngredient,result)=>{
    db.con.query("UPDATE Ingredientes SET ativo = 0 WHERE nome = ? AND ativo = 1;", idIngredient, (err,res)=>{
        if(err){
            console.log("Error", err)
            result(err,null)
        }
        else if(res.affectedRows == 0){
            result({kind:"not_found"},null)
        }
        else{
            result(null,"Eliminado Com sucesso")
        }
    })
}

module.exports = Ingredient
