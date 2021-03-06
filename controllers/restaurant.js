const Restaurant = require("../models/restaurant.js")
const db = require("../db")
const multer = require('multer')
const path = require('path')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

var S3_BUCKET

S3_BUCKET = process.env.S3_BUCKET


if(S3_BUCKET == null || S3_BUCKET =="" ){

    const awsConfig  = require("../aws.config.js")

    awsConfig.config

    S3_BUCKET = 'mealset'
    
}

aws.config.region='eu-west-2'
aws.config.signatureVersion='v4'


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
    
const name = req.body.name;
const description = req.body.description;
const parking = req.body.parking;
const foto = req.body.foto;
const address = req.body.address;
const gps = req.body.gps;
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
            gpsAddress: gps,
            address: address,
            zipCode: zipCode,
            active: 0
        })

        //Save Restaurant in the database
        Restaurant.create(restaurant,(err,data)=>{
            if(err){
                console.log("error catched")
                res.status(500).send({
                    message:err.message || "Ocorreu um erro"
                })
            }
            else{
                console.log("Sucesso na criação do restaurante")

                Restaurant.getLastId((err,data)=>{
                    if(err){
                        if(err.kind==="not_found"){
                            idUser = 0
                        }else{
                            console.log("Erro: ", err.message)
                               res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                               })
                        }
                    }else{
                        const lastIdRestaurant = data.idRestaurante

                        res.status(201).send({"success": lastIdRestaurant})
                    }  
                })
               
            }
           
            
        })
    }
}

exports.confirm = (req,res)=>{
    const idRestaurant = req.params.idRestaurant

    Restaurant.confirm(idRestaurant,(err,data)=>{
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
           res.status(200).send({"success": "Restaurante confirmado com sucesso"})
       }
    })
}

exports.update = (req,res) =>{
    //validate request
    if(!req.body){
        res.status(400).send({
            message:"Content Can't be empty!" 
        })
    }else{

        const name = req.body.name
        const description = req.body.description
        const parking = req.body.parking
        const gps = req.body.gps
        const address = req.body.address
        const zipCode = req.body.zipCode
        const idRestaurant = req.params.idRestaurant
 
       const restaurant = new Restaurant({
            name: name,
            description: description,
            parking: parking,
            gpsAdress: gps,
            address: address,
            zipCode: zipCode,
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
    const s3 = new aws.S3();
  
    

   

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
   
    const upload = multer({
        storage:multerS3({
            s3:s3,
            bucket:S3_BUCKET,
    
            key: function(req,file,cb){
                cb(null,uniqueSuffix+path.extname(file.originalname))
            },
            ALC:'public-read'
        }),
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
            console.log("Images:  ", req.files.logo[0].key)
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

                let logo = `https://mealset.s3.eu-west-2.amazonaws.com/${req.files.logo[0].key}`
                let cover = `https://mealset.s3.eu-west-2.amazonaws.com/${req.files.cover[0].key}`

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

exports.uploadLogo = (req,res) =>{

    const s3 = new aws.S3();
    const idRestaurant = req.params.idRestaurant

    /*
    const storage = multerS3({
        s3:s3.con,
        bucket:'mealset',
        acl:'public-read',
        key:function(req,file,cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    })
    */
 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    var upload = multer({
        storage:multerS3({
            s3:s3,
            bucket:S3_BUCKET,
    
            key: function(req,file,cb){
                cb(null,uniqueSuffix+path.extname(file.originalname))
            },
            ALC:'public-read'
        }),
        
        fileFiler:function(req,file,cb){
            checkFileType(file,cb);
        }
        
    }).single("logo")

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
            console.log("Image name and location: ", req.file.key)

            //res.send('test')

            if(req.file == undefined){
                res.status(400).send({msg:"Error:no File Selected!"}) // 400 = bad request
            }else{
                //console.log(req.files.logo[0].filename)
                /* 
                res.status(201).send({
                    
                    msg:'File Uploaded!',
                    file:`public/uploads/${req.files.logo[0].filename}`
                })
                */

                let logo = `https://mealset.s3.eu-west-2.amazonaws.com/${req.file.key}`
                

                Restaurant.uploadLogo(idRestaurant,logo,(err,data)=>{
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

exports.uploadCover = (req,res) =>{

    const s3 = new aws.S3();
    const idRestaurant = req.params.idRestaurant

    /*
    const storage = multerS3({
        s3:s3.con,
        bucket:'mealset',
        acl:'public-read',
        key:function(req,file,cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    })
    */
 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    var upload = multer({
        storage:multerS3({
            s3:s3,
            bucket:S3_BUCKET,
    
            key: function(req,file,cb){
                cb(null,uniqueSuffix+path.extname(file.originalname))
            },
            ALC:'public-read'
        }),
        
        fileFiler:function(req,file,cb){
            checkFileType(file,cb);
        }
        
    }).single("cover")

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
            console.log("Image name and location: ", req.file.key)

            //res.send('test')

            if(req.file == undefined){
                res.status(400).send({msg:"Error:no File Selected!"}) // 400 = bad request
            }else{
                //console.log(req.files.logo[0].filename)
                /* 
                res.status(201).send({
                    
                    msg:'File Uploaded!',
                    file:`public/uploads/${req.files.logo[0].filename}`
                })
                */

                let cover = `https://mealset.s3.eu-west-2.amazonaws.com/${req.file.key}`
                

                Restaurant.uploadCover(idRestaurant,cover,(err,data)=>{
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

exports.linkUpload = (req,res) =>{
    const logo = req.body.logo
    const cover = req.body.cover
    const idRestaurant = req.params.idRestaurant

    Restaurant.linkUpload(idRestaurant,logo,cover,(err,data)=>{
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
