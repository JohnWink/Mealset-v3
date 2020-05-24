const Rating = require("../models/plate_rating.js")
const db = require("../db")

exports.findById = (req,res) =>{

    const idPlate = req.params.idPlate
    const idUser = req.params.idUser

    Rating.findById(idPlate,idUser,(err,data)=>{
      
        if (err) {
            if(err.kind === "not_found"){
                res.status(404).send({
                    "Not Found": `Nenhum Rating foi encontrado.`
                }); 
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } 
        else {
            res.status(200).send({"success":[data]})
        }
    })
}

exports.findByPlate = (req,res) =>{

    const idPlate = req.params.idPlate

    Rating.findByPlate(idPlate,(err,data)=>{
        if (err) {
            if(err.kind === "not_found"){
                res.status(404).send({
                    "Not Found": `Nenhum Rating foi encontrado.`
                }); 
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } 
        else {
            res.status(200).send({"success":[data]})
        }
    }) 
}

exports.findByUser = (req,res) =>{

    const idUser = req.params.idUser

    Rating.findByUser(idUser,(err,data)=>{
        if (err) {
            if(err.kind === "not_found"){
                res.status(404).send({
                    "Not Found": `Nenhum Rating foi encontrado.`
                }); 
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } 
        else {
            res.status(200).send({"success":[data]})
        }
    })
}

exports.create = (req,res) =>{

    if(!req.body){
        req.status(400).send({
            message:"Por favor preencha os requisitos"
        })
    }



    else{

        const idPlate = req.params.idPlate
        const idUser = req.params.idUser
        const value = req.body.value

        // Check if the Rating already exists
        Rating.findById(idPlate,idUser,(err,data)=>{
            if (err) {
                // if the rating doesn't exist yet
                if(err.kind === "not_found"){
                    // Create Rating
                    Rating.create(idPlate,idUser,value,(err,data)=>{
                        if (err) {
                            console.log("error catched")
                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })
                        }
                        else{
                            console.log("Sucesso na criação do rating")
                            res.status(201).send({ "success": "Rating Efetuado" })
                        }
                    })
                }
                else{
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }
            } 
            //If the Rating already exists
            else {
                res.status(409).send({"Conflict":"O user já fez o rating"})
            }
        })
        
    }
    
}

exports.update = (req,res) =>{

    if(!req.body){
        req.status(400).send({
            message:"Por favor preencha os requisitos"
        })
    }
    else{
        
        const idPlate = req.params.idPlate
        const idUser = req.params.idUser
        const value = req.body.value

        Rating.update(idPlate,idUser,value,(err,data)=>{
            if(err){
                if(err.kind ==="not_found"){
                    res.status(404).send({"Not found": "O rating não foi encontrado"})
                }
                else{
                    res.status(500).send({
                        message:err.message || "Occorreu um erro"
                    })
                }
              
            }
            else{
                res.status(200).send({"success":"O rating foi atualizado com sucesso!"})
            }
        })
    }
}


exports.delete =(req,res) =>{

    const idPlate = req.params.idPlate
    const idUser = req.params.idUser

    Rating.delete(idPlate,idUser,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `O rating não foi encontrado.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                });
            }
        }else{
             res.status(204).send();
        } 
    })
}

exports.deleteByUser = (req,res) =>{

    const idUser = req.params.idUser

    Rating.deleteByUser(idUser,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Os ratings do user não foi encontrado.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                });
            }
        }else{
             res.status(204).send();
        } 
    })
}