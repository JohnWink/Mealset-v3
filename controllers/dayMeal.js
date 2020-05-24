const DayMeal = require("../models/dayMeal.js")
const db = require("../db")

exports.findbyRestaurant = (req,res) =>{

    const idRestaurant = req.params.idRestaurant

    DayMeal.findByRestaurant(idRestaurant,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Os pratos do dia não foram encontrados" })
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

exports.findByDay = (req,res) =>{

    const idDayMeal = db.con.escape(req.params.idDayMeal)

    DayMeal.findByDay(idDayMeal,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Os pratos do dia não foram encontrados" })
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

exports.findByPlate = (req,res) =>{

    const idPlate = req.params.idPlate

    DayMeal.findByPlate(idPlate,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Os pratos do dia não foram encontrados" })
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

exports.create = (req,res) =>{
    
    const idDayMeal = db.con.escape(req.params.idDayMeal)
    const idPlate = req.params.idPlate

        DayMeal.findById(idDayMeal,idPlate,(err,data)=>{

            if (err) {

                if (err.kind === "not_found") {

                   DayMeal.create(idDayMeal,idPlate,(err,data)=>{

                    if (err) {

                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })

                    } else {
                        res.status(201).send({ "success": "Prato do dia criado" })
                    }
                   })

                } else {
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }
            } else {
                res.status(409).send({ "conflict": "O prato do dia já existe" })
            }
        })
    
}

exports.update = (req,res) =>{

    const idDayMeal = db.con.escape(req.params.idDayMeal)
    const idPlate = req.params.idPlate

    DayMeal.findById(idDayMeal,idPlate,(err,data)=>{

        if (err) {

            if (err.kind === "not_found") {

               DayMeal.update(idDayMeal,idPlate,(err,data)=>{

                if (err) {
                    if(err.kind==="not_found"){
                        res.status(404).send({ "Not found": "Ou o prato ou o dia não foi encontrado" })
                    }
                    else{
                        res.status(500).send({
                            message: err.message || "Ocorreu um erro"
                        })
                    }

                       

                } else {
                    res.status(200).send({ "success": "Prato do dia foi atualizado" })
                }
               })

            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {
            res.status(409).send({ "conflict": "O prato do dia já existe" })
        }
    })
}

exports.delete = (req,res) =>{
    
    const idDayMeal = db.con.escape(req.params.idDayMeal)
    const idPlate = req.params.idPlate

    DayMeal.delete(idDayMeal,idPlate,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "O prato do dia não foi encontrado" })
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

exports.deleteByRestaurant = (req,res) =>{


    const idRestaurant = req.params.idRestaurant
    
    DayMeal.deleteByRestaurant(idRestaurant,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Nenhum prato do dia foi encontrado" })
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

exports.deleteByPlate = (req,res) =>{

    const idPlate = req.params.idPlate

    DayMeal.deleteByPlate(idPlate,(err,data)=>{
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Nenhum prato do dia foi encontrado" })
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

