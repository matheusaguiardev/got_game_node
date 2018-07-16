module.exports.index = function(app, req, res){
    res.render('index', {validacao:{}});
}

module.exports.autenticar = function(app, req, res){
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não pode estar vazio').notEmpty();
    req.assert('senha', 'Senha não pode estar vazio').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render("index", {validacao: erros});
        return;
    }

    var connection = app.config.dbConnection; 

    var usuariosDAO = new app.app.models.UsuariosDAO(connection);

    usuariosDAO.autenticar(dadosForm, req, res);

}