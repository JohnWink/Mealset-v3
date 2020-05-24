var rp = require('request-promise')


exports.findAll = (req,res) =>{
    
    var options = {

        uri: 'http://centraldedados.pt/api.json',

        json:true
        
    };

    
     
    rp(options)
   
        .then(function (response) {
            console.log("test")
            res.status(200).send(response)
        })
        .catch(function (err) {
            console.log("error:",err)
           res.status(500).send({message: err.message || "Ocorreu um erro"})
        });


}