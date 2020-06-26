const db = require("../db")

const Notification = function(notification) {
    this.idUser = notification.idUser
    this.idRestaurante = notification.idRestaurant
    this.status = notification.status
    this.mensagem = notification.message
    this.data = notification.dateTime
}

Notification.getByUser = (idUser,result) =>{
    db.con.query("SELECT * FROM Notificações WHERE idUser = ?  AND ativo = 1",idUser,(err,res)=>{
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

Notification.getByRestaurant = (idRestaurant,result) =>{
    db.con.query("SELECT * FROM Notificações WHERE idRestaurante = ?  AND ativo = 0",idUser,(err,res)=>{
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

Notification.update = (newNotification,idNotification,result) =>{
    db.con.query("UPDATE Notificações SET ? WHERE  idNotificações = ? AND ativo=1",
    [newNotification,idNotification], (err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,"Notificação atualizada")
        }
    })
}

Notification.readByRestaurant = (idRestaurant,result) =>{
    db.con.query("UPDATE Notificações SET lido = 1 WHERE  idRestaurante = ? AND ativo=1",
    idRestaurant, (err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,"Notificações lidas")
        }
    })
}
Notification.readByUser = (idUser,result) =>{
    db.con.query("UPDATE Notificações SET lido = 1 WHERE  idUser = ? AND ativo=1",
    idUser, (err,res)=>{
        if(err){
            console.log("Error:", err)
            return result(err,null)
        }else if(res.affectedRows == 0){
            return result({kind:"not_found"},null)
        }
        else{
            return result(null,"Notificações lidas")
        }
    })
}
Notification.create = (newNotification,result) =>{
    db.con.query("INSERT INTO Notificações SET ?",
    newNotification, (err,res)=>{

        if(err){
            console.log("Error:", err)
            return result(err,null)
        }
      
        else{
            return result(null,"Notificação criada")
        }
    })
}
module.exports = Notification
