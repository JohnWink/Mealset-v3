const Ingredient = require("../models/ingredient.js")
const db = require("../db.js")

exports.getAll = (req, res) => {
    Ingredient.getAll((err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Os ingredientes não foram encontrados" })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {
            res.status(200).send({ "success": [data] })
        }
    })
}

exports.findById = (req, res) => {

    const ingredient = db.con.escape(req.params.idIngredient)

    Ingredient.findById(ingredient, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "O ingrediente não foi encontrado" })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }
        else {
            res.status(200).send({ "success": [data] })
        }
    })
}

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Content cannot be empty" })
    }
    else {

        const name = db.con.escape(req.body.name)
        const idIngredient = db.con.escape(req.body.idIngredient)

        Ingredient.findById(name,(err,data)=>{
            if(err){
                // If there's no existing Ingredient with the updated name.
                if(err.kind==="not_found"){
                    // Begin the update
                    Ingredient.update(idIngredient, name, (err, data) => {
                        if (err) {
                            if (err.kind === "not_found") {
                                res.status(404).send({ "Not found": "O ingrediente não foi encontrado" })
                            } else {
                                res.status(500).send({
                                    message: err.message || "Ocorreu um erro"
                                })
                            }
                        }
                        else {
                            res.status(200).send({ "success": "O ingrediente foi atualizado com sucesso" })
                        }
                    })
                }else{
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }
            }else{
                res.status(409).send({"Conflict" : "O ingrediente já existe"})
            }
        })
     
    }
}

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({ message: "Por favor preencha os requisitos" })
    }
    else {

        const name = db.con.escape(req.body.name)

        Ingredient.findById(name,(err,data)=>{
            if(err){
                if(err.kind ==="not_found"){
                    Ingredient.create(name, (err, data) => {
                        if (err) {
                            res.status(500).send({
                                message: err.message || err
                            })
                        }
                        else {
                            res.status(201).send({ "success": "O ingrediente foi criado com sucesso" })
                        }
                    })
                }else{
                    res.status(500).send({
                        message: err.message || err
                    })
                }
            }else{
                res.status(409).send({"Conflict" : "O ingrediente já existe"})
            }
        })
       
    }
}

exports.delete = (req, res) => {

    const idIngredient = db.con.escape(req.params.idIngredient)
    
    Ingredient.delete(idIngredient, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "O ingrediente não foi encontrado" })
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }
        else {
            res.status(204).send()
        }
    })
}