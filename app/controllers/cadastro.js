module.exports.cadastro = function(app, req, res){
    res.render('cadastro',{validacao:{}, form:{}});
}

module.exports.cadastrar = function(app, req, res){
    var dadosForm = req.body;
    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Certifique-se de ter uma senha').notEmpty();
    req.assert('casa', 'Selecione uma casa').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render('cadastro', {validacao: erros, form: dadosForm});
        return;
    }

    var connDB = app.config.dbConnection; 

    var UsuariosDAO = new app.app.models.UsuariosDAO(connDB);
    var JogoDAO = new app.app.models.JogoDAO(connDB);

    UsuariosDAO.inserirUsuario(dadosForm);
    JogoDAO.gerarParametros(dadosForm.usuario)

    res.render('index', {validacao:{}});
}