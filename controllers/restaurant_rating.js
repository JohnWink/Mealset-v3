const Rating = require("../models/restaurant_rating.js")
const db = require("../db")

exports.getAll = (req, res) => {
    Rating.getAll((err, data) => {
        //If something goes wrong getting the data from the database: 
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Ratings não foram encontrados" })
            }
            else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }

        } else {
            res.status(200).send({ "success": [data] })
        }
    })

}

exports.findById = (req, res) => {

    const idRestaurant = req.params.idRestaurant
    const idUser = req.params.idUser
    
    Rating.findById(idRestaurant, idUser, (err, data) => {

        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhum Rating foi encontrado.`
                });
            }
            else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }
        else {
            res.status(200).send({ "success": [data] })
        }
    })
}


exports.findByUser = (req, res) => {

    const idUser = req.params.idUser

    Rating.findByUser(idUser, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Nenhum Rating foi encontrado.`
                });
            }
            else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        }
        else {
            res.status(200).send({ "success": [data] })
        }
    })
}

exports.findByRestaurant = (req, res) => {

    const idRestaurant = req.params.idRestaurant

    Rating.findByRestaurant(idRestaurant, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({ "Not found": "Ratings não encontrados" })
            }
            else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                })
            }
        } else {
            res.status(200).send({ "success": [data] })
        }
    })

}

exports.create = (req, res) => {

    if (!req.body) {
        req.status(400).send({
            message: "Por favor preencha os requisitos"
        })
    }

    else {

        const idRestaurant = req.params.idRestaurant
        const idUser = req.params.idUser
        const value = req.body.rating
        const comment = db.con.escape(req.body.comment)
        const dateTime =req.body.dateTime

        // Check if the Rating already exists
        Rating.findById(idRestaurant,idUser, (err, data) => {
            if (err) {
                // if the rating doesn't exist yet
                if (err.kind === "not_found") {

                    const rating = new Rating({
                        idRestaurant: idRestaurant,
                        idUser: idUser,
                        rating: value,
                        comment: comment,
                        dateTime: dateTime
                    })

                    // Create Rating
                    Rating.create(rating,(err, data) => {
                        if (err) {
                            console.log("error catched")
                            res.status(500).send({
                                message: err.message || "Ocorreu um erro"
                            })
                        }
                        else {
                            console.log("Sucesso na criação do rating")
                            res.status(201).send({ "success": "Rating Efetuado" })
                        }
                    })
                }
                else {
                    res.status(500).send({
                        message: err.message || "Ocorreu um erro"
                    })
                }
            }
            //If the Rating already exists
            else {
                res.status(409).send({ "Conflict": "O user já fez o rating" })
            }
        })

    }

}

exports.update = (req, res) => {
    if (!req.body) {
        req.status(400).send({
            message: "Por favor preencha os requisitos"
        })
    }
    else {
        const rating = req.body.rating;
        const comment = db.con.escape(req.body.comment);
        const dateTime = req.body.dateTime;
        const idRestaurant = req.params.idRestaurant;
        const idUser = req.params.idUser;

        let user = {
            rating: rating,
            comment: comment,
            dateTime: dateTime
        }

        Rating.update(user,idRestaurant,idUser, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({ "Not found": "O rating não foi encontrado" })
                }
                else {
                    res.status(500).send({
                        message: err.message || "Occorreu um erro"
                    })
                }

            }
            else {
                res.status(200).send({ "success": "O rating foi atualizado com sucesso!" })
            }
        })
    }
}


exports.delete = (req, res) => {

    const idRestaurant = req.params.idRestaurant;
    const idUser = req.params.idUser;

    Rating.delete(idRestaurant, idUser , (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `O rating não foi encontrado.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                });
            }
        } else {
            res.status(204).send();
        }
    })
}

exports.deleteByUser = (req, res) => {

    const idUser = req.params.idUser
    
    Rating.deleteByUser(idUser, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    "Not Found": `Os ratings do user não foi encontrado.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Ocorreu um erro"
                });
            }
        } else {
            res.status(204).send();
        }
    })
}