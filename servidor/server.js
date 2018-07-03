var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var competenciasController = require('./controladores/competenciasController.js');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias/:id', competenciasController.getOne);
app.get('/competencias/:id/peliculas', competenciasController.getTwoMovies);
app.get('/competencias', competenciasController.searchAll);
app.post('/competencias/:idCompetencia/voto', competenciasController.addVote);
app.get('/competencias/:id/resultados', competenciasController.getMostVotedMovies);

app.post('/competencias', competenciasController.add);
app.delete('/competencias/:idCompetencia/votos', competenciasController.delete);
app.delete('/competencias/:idCompetencia', competenciasController.deleteCompetencia);
app.put('/competencias/:idCompetencia', competenciasController.updateCompetencia);

app.get('/generos', competenciasController.searchAllGenres);
app.get('/directores', competenciasController.searchAllDirectors);
app.get('/actores', competenciasController.searchAllActors);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});
