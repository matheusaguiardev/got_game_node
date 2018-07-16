module.exports.jogo = function(app, req, res){
    
    if(req.session.autorizado !== true){
        res.render('index', {validacao:{}});
        return;
    }

    var connection = app.config.dbConnection;
    var jogoDAO = new app.app.models.JogoDAO(connection);

    var usuario = req.session.usuario;
    var casa = req.session.casa;

    jogoDAO.iniciaJogo(res, {casa: casa, usuario: usuario});
    

}

module.exports.sair = function(app, req, res){
    req.session.destroy(function(err){
        res.render('index', {validacao:{}});
    });
}

module.exports.suditos = function(app, req, res){
    if(req.session.autorizado !== true){
        res.render('index', {validacao:{}});
        return;
    }
    res.render('aldeoes');
}

module.exports.pergaminhos = function(app, req, res){
    if(req.session.autorizado !== true){
        res.render('index', {validacao:{}});
        return;
    }

    var connection = app.config.dbConnection;
    var jogoDAO = new app.app.models.JogoDAO(connection);

    var usuario = req.session.usuario;

    jogoDAO.getAcoes(usuario, res);

}

module.exports.ordenar_acao_sudito = function(app, req, res){
   
    if(req.session.autorizado !== true){
        res.render('index', {validacao:{}});
        return;
    }
   
    var dadosForm = req.body;

    req.assert('acao', 'Uma ação deve ser informada').notEmpty();
    req.assert('quantidade', 'A quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo');
        return;
    }


    var connection = app.config.dbConnection;
    
    var jogoDAO = new app.app.models.JogoDAO(connection);

    dadosForm.usuario = req.session.usuario;
    
    jogoDAO.acao(dadosForm);

    res.redirect('jogo');
}

module.exports.revogar_acao = function(app, req, res){
    var url_query = req.query;

    var connection = app.config.dbConnection;
    var JogoDAO = new app.app.models.JogoDAO(connection);


    var _id = url_query.id_acao;
    JogoDAO.revogarAcao(_id);

    res.redirect('jogo');

}