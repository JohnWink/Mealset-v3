var rp = require('request-promise')


exports.findAllCities = (req,res) =>{
    
    var options = {

        uri: 'http://api.geonames.org/searchJSON?country=PT&cities1000&username=johnwink',

        json:true
        
    };

    rp(options)
   
        .then(function (response) {
            console.log("test")

            let info = response.geonames
            let result = []
            
            for(let i = 0; i < info.length;i++){
                result.push(info[i].name)
            }
            res.status(200).send(result)
        })
        .catch(function (err) {
            console.log("error:",err)
           res.status(500).send({message: err.message || "Ocorreu um erro"})
        });


}