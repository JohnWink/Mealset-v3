module.exports = app =>{

    const user = require("../controllers/user.js");
    
    app.get('/users/:idUser',user.findById);

    app.get('/users', user.findAll);

    app.get('/confirm/:token',user.confirm);

    app.get('/confirm/:token/:password', user.passwordUpdate)

    app.post('/login',user.login);

    app.post('/signUp',user.signUp);

    app.put('/users/:idUser',user.update);

    app.put('/users/:idUser/newPassword',user.newPassword)

    app.put('/users/:idUser/upload',user.upload)

    app.put('/users/:idUser/linkUpload',user.linkUpload)

    //app.delete('/users/:idUser',user.delete);
    
}