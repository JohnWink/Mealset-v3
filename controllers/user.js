const User = require('../models/user.js');
const Restaurant = require('../models/restaurant.js')
const bcrypt = require("bcrypt");
var config = require('../config');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer')
const db = require("../db")

const path = require('path')

const multer = require('multer')
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








exports.findById = (req,res) =>{

    const idUser = req.params.idUser

    User.findById(idUser,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "User não foi encontrado"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            res.status(200).send({"success": data})
        }
    })
}

exports.findAll = (req,res) =>{

    User.findAll((err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "Nenhum User foi encontrado"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            res.status(200).send({"success": data})
        }
    })
}

function sendSignUpMail(email){

    let idUser = 0
            
    User.getLastId((err,data)=>{
        if(err){
            if(err.kind==="not_found"){
                idUser = 0
            }else{
                console.log("Erro: ", err.message)
            }
        }else{

            idUser = data[0].idUser
            console.log(idUser)
            // If no errors or conflicts are encountered:
            var token = jwt.sign({id:idUser}, config.secret, {
                expiresIn: new Date().getTime() +  10 * 60 * 1000 // expires in 10 min
            });

            var transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:'devjohnwink@gmail.com',
                    pass:'higvebgbfblcfgni'
                }
            })

            var mailOptions = {
                from:'devjohnwink@gmail.com',
                to:email,
                subject:"Registo MealSet",
                html:'<h1>Obrigado registar no MealSet! Por favor confirme a sua conta clicando no link abaixo!</h1><a href="https://mealset.herokuapp.com/confirm/'+token+'"><H2>Clique aqui!</H2></a>'
            }

            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err);
                    console.log("Erro: ", err.message)
                }else{
                    console.log('Message sent: ' + info.response);
                   console.log("Email enviado")
                }
            })
        
        }
    })
}


exports.signUp = (req,res)=>{
    
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }else{
        const username = req.body.username
        const email = req.body.email
        const contact = req.body.contact
        const password = req.body.password
        const idRestaurant = req.body.idRestaurant
        const userType = req.body.userType
        

        User.findAll((err,data)=>{
            if (err){
                if(err.kind==="not_found"){
                    bcrypt.hash(password,10).then(function(hash){
                        const user = new User({
                            username : username,
                            email: email,
                            contact: contact,
                            password:hash,
                            idRestaurant: idRestaurant,
                            userType: userType,
                            active:0
                        })
                        
                        User.signUp(user,(err,data)=>{
                            if(err){  
                                return res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }
                  
                            else{
                                sendSignUpMail(email)
                                User.getLastId((err,data)=>{
                                    if(err){

                                        if(err.kind==="not_found"){
                                            idUser = 0
                                        }else{
                                            console.log("Erro: ", err.message)
                                        }

                                    }else{

                                        const lastUserId = data[0].idUser

                                        return res.status(201).send({"success": lastUserId})

                                    }
                                })
                                
                            }
                           
                        })
                        
                    })
                    
                }else{
                    return res.status(500).send({message:err.message ||"Ocorreu um erro"})
                }
                
            }else{
                
                let conflict = false
                //Checks if there's a conflicting email or username
                data.find((data)=>{
                    
                    if(data.email=== email  || data.username === username){
                        conflict = true
                       return 
                    }
                })
                console.log(conflict)
              

                if(conflict == false){
                    bcrypt.hash(password,10).then(function(hash){
                        const user = new User({
                            username : username,
                            idRestaurant: idRestaurant,
                            email: email,
                            contact: contact,
                            password:hash,
                            userType: userType, 
                            active:0
                        })
                        
                        User.signUp(user,(err,data)=>{
                            if(err){  
                                return res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }
                            /* 
                            else if (!err){
                               
                                // create a token
                                var token = jwt.sign({id:data[0].idUser}, config.secret, {
                                    expiresIn: 86400 // expires in 24 hours
                                });
                                return res.status(200).send({ auth: true, token: token });
                            }
                            */
                     
                           else{
                           
                            sendSignUpMail(email)
                             User.getLastId((err,data)=>{
                                    if(err){

                                        if(err.kind==="not_found"){
                                            idUser = 0
                                        }else{
                                            console.log("Erro: ", err.message)
                                        }

                                    }else{

                                        const lastUserId = data[0].idUser

                                        return res.status(201).send({"success": lastUserId})
                                        
                                    }
                                })
                           } 
                           
                        })
                    })

                }else{
                    return res.status(409).send({"conflict":"O nome do utilizador ou email já está a ser utilizado"})
                }
                

                
            }
           


            

        })
    }
}




exports.verifyToken = (req,res,next)=>{
    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
      
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        
      // if everything good, save to request for use in other routes
      req.idUser = decoded.id;
      next();
    });
}




exports.confirm = (req,res) =>{
    
    var token = req.params.token

    var data = jwt.decode(token,config.secret);
    
    console.log(data)
    console.log(new Date(data.exp));
    console.log(new Date());

    if(new Date(data.exp)> new Date()){
        
            console.log("user found");

            User.confirm(data.id,(err,result)=>{
                if(err){
                    if(err.kind==="not_found"){
                        res.status(404).send({"not found": "O utilizador não foi encontrado"})
                    }
                    else{
                        res.status(500).send({message:err.message || "Ocorreu um erro"})
                    }
                }else{
                    User.findById(data.id,(err,result)=>{
                       if(err){
                            if(err.kind==="not_found"){
                                res.status(404).send({"not found": "O utilizador não foi encontrado"})
                            }
                            else{
                                res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }
                       }else{

                        let username = result[0].username
                        let idRestaurant = result[0].idRestaurante

                        if(idRestaurant != null){
                            Restaurant.confirm(result[0].idRestaurante,(err,result)=>{
                                if(err){
                                    if(err.kind==="not_found"){
                                        res.status(404).send({"not found": "O utilizador não foi encontrado"})
                                    }
                                    else{
                                        res.status(500).send({message:err.message || "Ocorreu um erro"})
                                    }
                                }else{
                                    res.status(200).render('signUpConfirm.html',{
                                    name: username
                                    })
                                }
                            })
                        }else{
                            res.status(200).render('signUpConfirm.html',{
                            name: username
                            })
                        }
                            
                       } 
                    })
                    
                }
            })
        
    }else{
        console.log("Link is expired");
        res.status(401).send({"Expired":"O token passou o prazo de validade"})
    }
}



exports.login = (req,res) =>{

    const username = req.body.username
    const password = req.body.password

    
        User.findAll((err,data)=>{
            if(err){
                if(err.kind==="not_found"){
                    res.status(404).send({"not found": "Nenhum utilizador foi encontrado"})
                }else{
                    res.status(500).send({message:err.message || "Ocorreu um erro"})
                }
            }else{

                let found = false
                let idUserData = 0
                let errorMessage = ""
                let userTypeData = ""
                let usernameData = ""
                let dietData = ""
                let emaiData=""
                let contactData = 0
                let idRestaurantData = 0
                data.find((data)=>{
              
                    if(data.username == username && bcrypt.compareSync(password,data.password)){

                        idUserData = data.idUser
                        userTypeData = data.userType
                        usernameData = data.username
                        dietData = data.dieta
                        emaiData = data.email
                        contactData = data.contacto
                        avatarData = data.avatar
                        idRestaurantData = data.idRestaurante


                        
                        found = true
                      
                    }
                })

              
                if(found == true){
                    var token = jwt.sign({ id: data.idUser }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                      });

                    res.status(201).send({ 
                        auth: true,
                        token: token,
                        idUser: idUserData,
                        username:usernameData, 
                        diet:dietData,email:emaiData,
                        avatar: avatarData,
                        contact:contactData,
                        idRestaurant:idRestaurantData,  
                        userType:userTypeData });
                }else{
                    res.status(401).send({ auth: false, token: null, message:"As credenciais são inválidas" });
                }
            }
        })
      
}


exports.update = (req,res) =>{

    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }
    else{
        const contact = req.body.contact;
        const diet = req.body.diet;
        const idUser = req.params.idUser

        let user={
            contact:contact,
            diet: diet
        }
            
        User.update(user,idUser,(err,data)=>{
            if(err){
                if(err.kind === "not_found"){

                    res.status(404).send({"Not found": "User não foi encontrado"})

                }else{

                    res.status(500).send({message:err.message ||"Ocorreu um erro"})

                }
            }
            else{
                User.findById(idUser,(err,data)=>{
                    if(err){
                        if(err.kind === "not_found"){
                            res.status(404).send({"Not found": "User não foi encontrado"})
                        }else{
                            res.status(500).send({message:err.message ||"Ocorreu um erro"})
                        }
                    }
                    else{
                        res.status(200).send({"success": data})
                    }
                })
                //res.status(200).send({"success":"Os dados foram atualizados com sucesso"})
            }
        }) 
    }

}

exports.newPassword = (req,res)=>{
    if(!req.body){
        res.status(400).send({message:"Content cannot be empty"})
    }else{
        const idUser = req.params.idUser
        const password = req.body.password
        const newPassword = req.body.newPassword
        let email = ""



        User.findAll((err,data)=>{
            if(err){
                if(err.kind==="not_found"){
                    res.status(404).send({"not found": "Nenhum utilizador foi encontrado"})
                }else{
                    res.status(500).send({message:err.message || "Ocorreu um erro"})
                }
            }else{

                let found = false
                let errorMessage = ""

                data.find((data)=>{
              
                    if(data.idUser == idUser && bcrypt.compareSync(password,data.password)){

                        found = true
                        email = data.email
                      
                    }
                })

              
                if(found == true){
                    var token = jwt.sign({id:idUser}, config.secret, {
                        expiresIn: new Date().getTime() + 10 * 60 * 1000 // expires in 10 min
                    });
            
                    var transporter = nodemailer.createTransport({
                        service:'gmail',
                        auth:{
                            user:'devjohnwink@gmail.com',
                            pass:'higvebgbfblcfgni'
                        }
                    })
                    
                    
                        var mailOptions = {
                            from:'devjohnwink@gmail.com',
                            to:email,
                            subject:"Confirmar nova password",
                            html:'<h1>Por favor confirme a sua nova password clicando no link abaixo!</h1><a href="https://mealset.herokuapp.com/confirm/'+token+'/'+newPassword+'"><H2>Clique aqui!</H2></a>'
                        }
                
                        transporter.sendMail(mailOptions,function(err,info){
                            if(err){
                                console.log(err);
                                res.status(500).send({message:err.message || "Ocorreu um erro"})
                            }else{
                                console.log('Message sent: ' + info.response);
                                return res.status(200).send({"success": "Por favor verifique o seu email para confirmar a sua nova password."});
                            }
                        })
                   
                    
                }else{
                    res.status(401).send({ auth: false, token: null, message:"A password é  inválida" });
                }
            }
        })

       

    }
   
}

exports.linkUpload = (req,res) =>{
    const link = req.body.link
    const idUser = req.params.idUser
    console.log("link: ", link)
    console.log("user: ", idUser)
    User.findById(idUser,(err,data)=>{
        if(err){
            if(err.kind === "not_found"){
                res.status(404).send({"Not found": "User não foi encontrado"})
            }else{
                res.status(500).send({message:err.message ||"Ocorreu um erro"})
            }
        }
        else{
            console.log("we're here")
            User.linkUpload(idUser,link,(err,data)=>{
                if(err){
                    if(err.kind === "not_found"){
                        res.status(404).send({"Not found" : "User não foi encontrado"})
                    }
                    else{
                        res.status(500).send({
                            message: err.message || "Ocorreu um erro"
                        })
                    }
               }else{
                
                   res.status(200).send({"success": "User Atualizado com sucesso"})
               }
            })
        }
    })


}

exports.upload = (req,res) =>{

    const s3 = new aws.S3();
    const idUser = req.params.idUser

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
        
    }).single("avatar")

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

                let avatar = `https://mealset.s3.eu-west-2.amazonaws.com/${req.file.key}`
                

                User.upload(idUser,avatar,(err,data)=>{
                    if(err){
                        if(err.kind === "not_found"){
                            res.status(404).send({"Not found" : "User não foi encontrado"})
                        }
                        else{
                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })
                        }
                   }else{
                    
                       res.status(200).send({"success": "User Atualizado com sucesso"})
                   }
                })
                
            }
        }
    })


}

exports.passwordUpdate = (req,res) =>{

    const token = req.params.token
    const password = req.params.password

    var data = jwt.decode(token,config.secret);

    console.log(data)
    console.log(new Date(data.exp));
    console.log(new Date());

    if(new Date(data.exp)> new Date()){
        
            console.log("user found");

            bcrypt.hash(password,10).then(function(hash){
                
            User.updatePassword(data.id,hash,(err,result)=>{
                if(err){
                    if(err.kind==="not_found"){
                        res.status(404).send({"not found": "O utilizador não foi encontrado"})
                    }
                    else{
                        res.status(500).send({message:err.message || "Ocorreu um erro"})
                    }
                }else{
                    res.status(200).render('newPasswordConfirm.html')
                    //res.status(200).send({"success":"A nova password foi introduzida com êxito"})
                }

            })
        })
        
    }else{
        console.log("Link is expired");
        res.status(401).send({"Expired":"O token passou o prazo de validade"})
    }




}