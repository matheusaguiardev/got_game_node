var ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection){
    this._connection = connection();
}

JogoDAO.prototype.gerarParametros = function(usuario){
    this._connection.open(function(err, mongoClient){
        mongoClient.collection("jogo", function(err, collection){
            collection.insert({
                usuario: usuario,
                moeda: 30,
                suditos: 10,
                temor: Math.floor(Math.random() * 1000),
                sabedoria: Math.floor(Math.random() * 1000),
                comercio: Math.floor(Math.random() * 1000),
                magia: Math.floor(Math.random() * 1000)
            });

            mongoClient.close();
            console.log('Conexão com o banco fechada');
        });
    });
}

JogoDAO.prototype.iniciaJogo = function(res, session){
    this._connection.open(function(err, mongoClient){
        mongoClient.collection("jogo", function(err, collection){
            collection.find({usuario: session.usuario}).toArray(function(err, result){
            
            res.render('jogo', {img_casa: session.casa, jogo: result[0]});

            mongoClient.close();
            console.log('Conexão com o banco fechada');
            });
        });
    });
}

JogoDAO.prototype.acao = function(acao){
   
    this._connection.open(function(err, mongoClient){
        mongoClient.collection("acao", function(err, collection){
            
            if(acao.quantidade < 1){
                return;
            }

            var date = new Date();
            
            var tempo = 0;

            switch(parseInt(acao.acao)){
                case 1: tempo = 1 * 60 * 60000; break;
                case 2: tempo = 2 * 60 * 60000; break;
                case 3: tempo = 5 * 60 * 60000; break;
                case 4: tempo = 5 * 60 * 60000; break;
            }

            acao.acao_termina_em = date.getTime() + tempo;

            collection.insert(acao);
        });

        mongoClient.collection("jogo", function(err, collection){
            let moedas = null;

            switch(parseInt(acao.acao)){
                case 1: moedas = -2 * acao.quantidade; break;
                case 2: moedas = -3 * acao.quantidade; break;
                case 3: moedas = -1 * acao.quantidade; break;
                case 4: moedas = -1 * acao.quantidade; break;
            }

            collection.update(
                { usuario: acao.usuario},
                { $inc: {moeda: moedas}});
 
            });
            mongoClient.close();
            console.log('Conexão com o banco fechada');
    });

}

JogoDAO.prototype.getAcoes = function(usuario, res){
    this._connection.open(function(err, mongoClient){
        mongoClient.collection("acao", function(err, collection){
           
            var date = new Date();
            var momento_atual = date.getTime();
           
            collection.find({usuario: usuario, acao_termina_em:{$gt:momento_atual}})
            .toArray(function(err, result){
           
            res.render('pergaminhos', {acoes: result});

            mongoClient.close();
            console.log('Conexão com o banco fechada');
            });
        });
    });
}

JogoDAO.prototype.revogarAcao = function(_id, res){
    this._connection.open(function(err, mongoClient){
        mongoClient.collection("acao", function(err, collection){
            collection.remove(
                {_id: ObjectID(_id)},
                function(err, result){
                    mongoClient.close();
                }
            );
        });
    });
}

module.exports = function(){
    return JogoDAO;
}