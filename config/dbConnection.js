/** Importar o mongodb */
var mongo = require('mongodb');

var connMongo = function(){
    console.log('Abriu uma conexão com o banco');
    var db = new mongo.Db(
        'got', // nome da tabela
        new mongo.Server(
            'localhost', // endereco do servidor
            27017, // porta de conexao
            {}
        ),
        {}
    );
    return db;
}

module.exports = function(){
   return connMongo;
}