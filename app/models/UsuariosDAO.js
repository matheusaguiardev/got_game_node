function UsuariosDAO(connection){
   this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(form){
   // console.log(this._connection);
    this._connection.open(function(err, mongoClient){
        mongoClient.collection("usuarios", function(err, collection){
            collection.insert(form);
            mongoClient.close();
            console.log('Conexão com o banco fechada');
        });
    });
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open(function(err, mongoClient){
        mongoClient.collection("usuarios", function(err, collection){
            collection.find(usuario).toArray(function(err, result){
                
                if(result[0] != undefined){
                    req.session.autorizado = true;
                    req.session.usuario = result[0].usuario;
                    req.session.casa = result[0].casa;
                }

                if(req.session.autorizado){
                    res.redirect("jogo");
                } else {
                    res.render("index", {validacao:{}});
                }

            });
            mongoClient.close();
            console.log('Conexão com o banco fechada');
        });
    });
}

module.exports = function(){
    return UsuariosDAO;
}