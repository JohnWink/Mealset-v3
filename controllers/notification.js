const Notification = require("../models/notification.js")

exports.getByUser = (req,res) =>{

    const idUser = req.params.idUser

    Notification.getByUser(idUser,(err,data)=>{
         //If something goes wrong getting the data from the database: 
         if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Notificações não foram encontrados"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
           
        }else{
            res.setHeader("Content-Type","application/json; charset=utf-8")
            res.status(200).send({"success":data})
        }
    })
}

exports.getByRestaurant = (req,res) =>{

    Notification.getByRestaurant(idRestaurant,(err,data)=>{
         //If something goes wrong getting the data from the database: 
         if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Notificações não foram encontrados"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
           
        }else{
            res.setHeader("Content-Type","application/json; charset=utf-8")
            res.status(200).send({"success":data})
        }
    })
}

exports.update = (req,res) =>{

    const idNotification = req.params.idNotification

    const notification = new Notification({
        status: req.body.status,
        message: req.body.message,
        dateTime: req.body.dateTime,
   })

    Notification.update(notification,idNotification,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Notificação não foi encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
       }else{
           res.status(200).send({"success": "Notificação Atualizado com sucesso"})
       }
    })
}

exports.readByRestaurant = (req,res)=>{
    const idRestaurant = req.params.idRestaurant
    Notification.readByRestaurant(idRestaurant,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Notificação não foi encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
       }else{
           res.status(200).send({"success": "Notificação Atualizado com sucesso"})
       }
    })
}

exports.readByUser = (req,res) =>{
    const idUser = req.params.idUser
    Notification.readByUser(idUser,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Notificação não foi encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
       }else{
           res.status(200).send({"success": "Notificação Atualizado com sucesso"})
       }
    })
}

exports.create = (req,res) =>{

    const notification = new Notification({
        idUser: req.params.idUser,
        idRestaurant: req.params.idRestaurant,
        status: req.body.status,
        message: req.body.message,
        dateTime: req.body.dateTime,
   })

    Notification.create(notification,(err,data)=>{
        if(err){
            console.log("error catched")
            res.status(500).send({
                message:err.message || "Ocorreu um erro"
            })
        }else{
            
            res.status(201).send({"success": "notificação adicionada"})
        }  
    })  
}