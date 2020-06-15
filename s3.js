const aws = require('aws-sdk')

module.exports={
     s3: new aws.S3({
        accessKeyId:'AKIAICOUDSBOEDVXXJZQ',
        secretAccessKey:'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',
        Bucket:'mealset'
    })
    
}

