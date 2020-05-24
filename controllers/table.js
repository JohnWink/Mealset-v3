const Table = require("../models/table.js")
const db = require("../db")

exports.getAll = (req,res) =>{

    const idRestaurant = req.params.idRestaurant

    Table.getAll(idRestaurant,(err,data) =>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "Mesas não foram encontradas"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
           
        }
        else{
            res.status(200).send({"success":[data]})
        }
    })
}

exports.findById = (req,res) => {

    const idTable = req.params.idTable

    Table.findById(idTable,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "Mesa não foi encontrada"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            res.status(200).send({"success": [data]})
        }
    })
}

exports.create = (req,res) =>{
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }
    else{

        const name = db.con.escape(req.body.name)
        const size = req.body.size
        const description = db.con.escape(req.body.description)
        const smoking = req.body.smoking
        const outside = req.body.outside
        const idRestaurant = req.params.idRestaurant

        const table = new Table({
            name: name,
            size: size,
            description: description,
            smoking:smoking,
            outside:outside,
            idRestaurant: idRestaurant
        })
       
        Table.create (table,(err,data)=>{
            if(err){
               
                res.status(500).send({message:err.message || "Ocorreu um erro"})
            }
            else{
                
                res.status(201).send({"success":"Registo Criado"})
            }
        })
    }
}

exports.update = (req,res) =>{
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }
    else{

        const name = db.con.escape(req.body.name)
        const size = req.body.size
        const description = db.con.escape(req.body.description)
        const smoking = req.body.smoking
        const outside = req.body.outside
        const idTable = req.params.idTable


        const table = new Table({
            name: name,
            size: size,
            description: description,
            smoking:smoking,
            outside:outside,
        })

        Table.update(idTable,table,(err,data)=>{
            if(err){
                if(err.kind === "not_found"){
                    res.status(404).send({"Not found": "Mesa não foi encontrada"})
                }else{
                    res.status(500).send({message:err.message ||"Ocorreu um erro"})
                }
            }
            else{
                res.status(200).send({"success":"Os dados foram atualizados com sucesso"})
            }
        })
       
    }
}

exports.delete = (req,res) =>{

    const idTable = req.params.idTable

    Table.delete(idTable,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "Mesa não foi encontrada"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            res.status(204).send()
        }
    })
}

exports.deleteAll = (req,res) =>{

    const idRestaurant = req.params.idRestaurant

    Table.deleteAll(idRestaurant,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "Mesas não foram encontradas"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            res.status(204).send()
        }
    })
}