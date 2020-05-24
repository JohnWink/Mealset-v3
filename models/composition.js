const db = require("../db")

const Composition = function (composition) {
    this.ingrediente = composition.ingredient
    this.quantidade = composition.quantity
    this.medida = composition.measurement
    this.idPrato = composition.idPlate
}

Composition.getAll = (idPlate, result) => {

    db.con.query('SELECT * FROM Composição WHERE idPrato = ? AND ativo = 1',
        idPlate, function (err, res) {
            if (err) {
                console.log(err)
                return result(err, null)


            }
            else if (!res[0]) {
                return result({ kind: "not_found" }, null)
            }
            else {

                console.log("Composições: ", res)
                return result(null, res)


            }
        })
}

Composition.findById = (idComposition, result) => {

    db.con.query("SELECT * FROM Composição WHERE idComposição = ? AND ativo = 1", idComposition, (err, res) => {

        if (err) {
            console.log("error:", err)
            return result(err, null)

        }
        // If there's no composition found
        else if (!res[0]) {
            return result({ kind: "not_found" }, null)


        }
        // If there's the found composition
        else {
            return result(null, res[0])

        }
    })

}

Composition.create = (newComposition, result) => {
    //Preparing to add new composition Database
    db.con.query("INSERT INTO Composição SET ?", newComposition, (err, res) => {
        if (err) {
            console.log("error:", err)
            return result(err, null)

        } else {
            console.log("Composição criada")
            return result(null, "Composição criada")

        }
    })
}


Composition.update = (idComposition, compositionInfo, result) => {

    db.con.query("UPDATE Composição SET ingrediente=?, quantidade=?, medida=? WHERE idComposição=? AND ativo = 1 ",
        [compositionInfo.ingrediente, compositionInfo.quantidade, compositionInfo.medida, idComposition],
        (err, res) => {
            if (err) {
                console.log("error:", err);
                return result(err, null)
            }
            //If no row has been affected/changed, an error will occur
            else if (res.affectedRows == 0) {
                return result({ kind: "not_found" }, null)
            } else {
                return result(null, "Composição Atualizada")
            }
        })
}


Composition.delete = (idComposition, result) => {
    db.con.query("UPDATE Composição SET ativo = 0 WHERE idComposição = ? AND ativo = 1", idComposition, (err, res) => {
        if (err) {
            console.log("error:", err);
            return result(err, null)
        }
        else if (res.affectedRows == 0) {
            return result({ kind: "not_found" }, null)
        }
        else {
            return result(null, "Composição eliminada")
        }
    })
}

Composition.deleteAll = (idPlate, result) => {
    db.con.query("UPDATE Composição  SET ativo = 0 WHERE idPrato = ? AND ativo = 1;",
        idPlate, (err, res) => {
            if (err) {
                console.log("error:", err);
                return result(err, null)
            }
            else if (res.affectedRows == 0) {
                return result({ kind: "not_found" }, null)
            }
            else {
                return result(null, "Composição eliminada")
            }
        })
}




module.exports = Composition