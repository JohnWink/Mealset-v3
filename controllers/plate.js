const Plate = require("../models/plate.js")
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


exports.getAll = (req, res) => {
    Plate.getAll((err, data) => {
        //If something goes wrong getting the data from the database: 
        if (err) {
            if(err.kind === "not_found"){
                res.status(404).send({
                    "Not Found": `Nenhum prato foi encontrado.`
                }); 
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {
            res.status(200).send({"success":[data]})
        }
    })

}


exports.findById = (req, res) => {

    const idPlate = req.params.idPlate

    Plate.findById(idPlate, (err, data) => {
        if (err) {
            if(err.kind === "not_found"){
                res.status(404).send({
                    "Not Found": `O prato não foi encontrado.`
                }); 
            }
            else{
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
            
        } else {
            res.status(200).send({"success":[data]})
        }
    })
}


exports.create = (req, res) => {

    //Validar pedido
    if (!req.body) {
        res.status(400).send({
            message: "Por favor preencha os requisitos"
        })
    }
    else {

        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const foto = req.body.foto
        const idRestaurant = req.params.idRestaurant

        //Create Plate
        const plate = new Plate({
            name: name,
            description: description,
            price: price,
            foto: foto,
            idRestaurant: idRestaurant
        })

        //Save Plate in the database
        Plate.create(plate, (err, data) => {
            if (err) {
                console.log("error catched")
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
            else{
                console.log("Sucesso na criação do prato")
                res.status(201).send({ "success": "Prato criado" })
            }
    

        })
    }
}
//Work in progress
exports.upload = (req,res) =>{

    const s3 = new aws.S3();
    const idPlate = req.params.idPlate

  
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
    }).single("imgDish")

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

            console.log(req.file.filename)

            if(req.file == undefined){
                res.status(400).send({msg:"Error:no File Selected!"})
            }else{
                let image = `public/uploads/${req.file.filename}`

                Plate.upload(idPlate,image,(err,data)=>{
                    if(err){
                        if(err.kind === "not_found"){
                            res.status(404).send({"Not found" : "Prato não foi encontrado"})
                        }
                        else{
                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })
                        }
                   }else{
                       res.status(200).send({"success": "Prato Atualizado com sucesso"})
                   }
                })
            }

        }
    })

}

exports.delete = (req, res) => {

    const idPlate = req.params.idPlate

    Plate.delete(idPlate, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `O prato não foi encontrado.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                });
            }
        }else{
             res.status(204).send();
        } 
    });
};

exports.deleteAll = (req, res) => {

    const idRestaurant = req.params.idRestaurant

    Plate.deleteAll(req.params.idRestaurant,(err, data) => {
      if (err){
          if(err.kind ==="not_found"){
            res.status(404).send({
                "Not Found": `O restaurante não foi encontrado.`
            }); 
          }
          else{
            res.status(500).send({
                message:
                err.message || "Ocorreu um erro"
            });
          }
      }
       
      else{
        console.log(data)
        res.status(204).send();
      }
    });
  }

  exports.update=(req,res) =>{
      if(!req.body){
          res.status(400).send({
              mesage:"Por favor preencha os requisitos"
          })
      }
      else{

        const name = req.body.name
        const description = req.body.description
        const price = req.body.price
        const foto = req.body.foto
        const idPlate = req.params.idPlate

          const plate = new Plate({
              name:name,
              description: description,
              price: price,
              foto: foto
          })

          Plate.update(idPlate,plate,(err,data)=>{
            if(err){
                if(err.kind ==="not_found"){
                    res.status(404).send({"Not found": "O prato não foi encontrado"})
                }
                else{
                    res.status(500).send({
                        message:err.message || "Ocorreu um erro"
                    })
                }
              
            }
            else{
                res.status(200).send({"success":"Os dados foram atualizados com sucesso"})
            }
          })
      }
  }