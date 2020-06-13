const Restaurant = require("../models/restaurant.js")
const db = require("../db")
const multer = require('multer')
const path = require('path')


 exports.getAll = (req,res) =>{
    Restaurant.getAll((err,data)=>{
        //If something goes wrong getting the data from the database: 
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Restaurantes não foram encontrados"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
           
        }else{
            res.setHeader("Content-Type","application/json; charset=utf-8")
            res.status(200).send({"success":[data]})
        }
    })
   
}

exports.findById = (req,res) =>{

    const idRestaurant = req.params.idRestaurant
 
    Restaurant.findById(idRestaurant,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Restaurante não foi encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }else{
           
            res.status(200).send({"success":[data]})
        }
    })
}


exports.create = (req,res) =>{
    
const name = db.con.escape(req.body.name);
const description = db.con.escape(req.body.description);
const parking = req.body.parking;
const foto = db.con.escape(req.body.foto);
const gpsAddress = db.con.escape(req.body.gpsAddress);
const gps = db.con.escape(req.body.gps);
const zipCode = req.body.zipCode;

    //Validar pedido
    if(!req.body){
        res.status(400).send({
            message:"Content Cannot be empty!"
        })
    }
    else{
        //Create Restaurant
        const restaurant = new Restaurant ({
            name: name,
            description: description,
            parking: parking,
            coverFoto: foto,
            gpsAddress: gpsAddress,
            address: gps,
            zipCode: zipCode
        })

        //Save Restaurant in the database
        Restaurant.create(restaurant,(err,data)=>{
            if(err){
                console.log("error catched")
                res.status(500).send({
                    message:err.message || "Ocorreu um erro"
                })
            }
                console.log("Sucesso na criação do restaurante")
                res.status(201).send({"success":"Restaurante Criado com sucesso"})
            
        })
    }
}

exports.update = (req,res) =>{
    //validate request
    if(!req.body){
        res.status(400).send({
            message:"Content Can't be empty!" 
        })
    }else{

        const name = db.con.escape(req.body.name)
        const description = db.con.escape(req.body.description)
        const parking = req.body.parking
        const foto = req.body.foto
        const gps = db.con.escape(req.body.gps)
        const address = db.con.escape(req.body.address)
        const zipCode = req.body.zipCode
        const idRestaurant = req.params.idRestaurant
 
       const restaurant = new Restaurant({
            name: name,
            description: description,
            parking: parking,
            coverFoto: foto,
            gpsAdress: gps,
            address: address,
            zipCode: zipCode
       })

       Restaurant.update(idRestaurant,restaurant,(err,data)=>{
           if(err){
                if(err.kind === "not_found"){
                    res.status(404).send({"Not found" : "Restaurante não foi encontrado"})
                }
                else{
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }
           }else{
               res.status(200).send({"success": "Restaurante Atualizado com sucesso"})
           }
       })
    }
}
// Work in progress 
exports.upload = (req,res)=>{

    const idRestaurant = req.params.idRestaurant

  
    

    const storage = multer.diskStorage({
        destination:"./public/uploads",
        filename: function(req,file,cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    })


    const upload = multer({
        storage:storage,
        fileFiler:function(req,file,cb){
            checkFileType(file,cb);
        }
    }).fields([{name:'cover',maxCount:1}, {name:'logo',maxCount:1}])

    function checkFileType(file,cb){

        const filetypes = /jpeg|jpg|png|gif/;

        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        const mimetype = filetypes.test(file.mimetype)

        if(mimetype && extname){
            return cb(null,true)
        }else{
            cb('Error: Images Only!')
        }
    }

    upload(req,res,(err)=>{
        if(err){
            console.log("error:", err)
            res.status(500).send({ message: err.message || "Ocorreu um erro"})
        }else{
            console.log("Images Processed!")
            //res.send('test')

            if(req.files == undefined){
                res.status(400).send({msg:"Error:no File Selected!"}) // 400 = bad request
            }else{
                //console.log(req.files.logo[0].filename)
                /* 
                res.status(201).send({
                    
                    msg:'File Uploaded!',
                    file:`public/uploads/${req.files.logo[0].filename}`
                })
                */

                let logo = `public/uploads/${req.files.logo[0].filename}`
                let cover = `public/uploads/${req.files.cover[0].filename}`

                Restaurant.upload(idRestaurant,logo,cover,(err,data)=>{
                    if(err){
                        if(err.kind === "not_found"){
                            res.status(404).send({"Not found" : "Restaurante não foi encontrado"})
                        }
                        else{
                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })
                        }
                   }else{
                       res.status(200).send({"success": "Restaurante Atualizado com sucesso"})
                   }
                })
                
            }
        }
    })




}
exports.delete = (req,res) =>{
    
    const idRestaurant = req.params.idRestaurant
    
    Restaurant.delete(idRestaurant,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found" : "Restaurante não foi encontrado"})
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }else{
            res.status(204).send()
        }
    })
}
