var conn = require('../conexiondb.js');

function getOne(req, res){
  var id = req.params.id;

  var query = "SELECT pregunta FROM competencia WHERE id = "+id+"";

  conn.query(query, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'nombre': resultado[0].pregunta
      };
      res.send(JSON.stringify(response));
  });
}

function searchAll(req, res){
  var query = "SELECT * FROM competencia WHERE state = 1";

  conn.query(query, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'competencias': resultado
      };
      res.send(JSON.stringify(response));
  });
}

function getTwoMovies(req, res){
  var id = req.params.id;

  var query = 'SELECT pregunta, genero_id, director_id, actor_id FROM competencia WHERE id = "'+id+'"';

  conn.query(query, function(error, resultado, fields){
    var pregunta = resultado[0].pregunta;
    var genero = resultado[0].genero_id;
    var director = resultado[0].director_id;
    var actor_actriz = resultado[0].actor_id;

    var newQuery = "";
    if(genero != undefined && director == undefined && actor_actriz == undefined) {
      //PARA GENERO
      newQuery = "SELECT * FROM pelicula WHERE genero_id = "+genero+" ORDER BY RAND() LIMIT 2;";
    }else if (genero == undefined && director != undefined && actor_actriz == undefined) {
      //PARA DIRECTOR
      newQuery = "SELECT p.id, p.titulo, p.poster FROM competencia c INNER JOIN director d ON d.id = c.director_id INNER JOIN director_pelicula dp ON dp.director_id = d.id INNER JOIN pelicula p ON p.id = dp.pelicula_id WHERE d.id = "+director+" ORDER BY RAND() LIMIT 2;";
    }else if (genero == undefined && director == undefined && actor_actriz != undefined) {
      //PARA ACTOR/ACTRIZ
      newQuery = "SELECT p.id, p.titulo, p.poster FROM competencia c INNER JOIN actor a ON a.id = c.actor_id INNER JOIN actor_pelicula ap ON ap.actor_id = a.id INNER JOIN pelicula p ON p.id = ap.pelicula_id WHERE a.id = "+actor_actriz+" ORDER BY RAND() LIMIT 2;";
    }else if (genero != undefined && director != undefined && actor_actriz == undefined) {
      //PARA GENERO Y DIRECTOR
      newQuery = "SELECT p.id, p.titulo, p.poster FROM competencia c INNER JOIN director d ON d.id = c.director_id INNER JOIN director_pelicula dp ON dp.director_id = d.id INNER JOIN genero g ON g.id = c.genero_id INNER JOIN pelicula p ON p.id = dp.pelicula_id  WHERE d.id = "+director+" AND g.id = "+genero+" ORDER BY RAND() LIMIT 2;";
    }else if (genero != undefined && director == undefined && actor_actriz != undefined) {
      //PARA GENERO Y ACTOR/ACTRIZ
      newQuery = "SELECT p.id, p.titulo, p.poster FROM competencia c INNER JOIN actor a ON a.id = c.actor_id INNER JOIN actor_pelicula ap ON ap.actor_id = a.id INNER JOIN genero g ON g.id = c.genero_id INNER JOIN pelicula p ON p.id = ap.pelicula_id WHERE c.genero_id = "+genero+" AND c.actor_id = "+actor_actriz+" ORDER BY RAND() LIMIT 2;";
    }else {
      //PARA TODOS
      newQuery = "SELECT * FROM pelicula ORDER BY RAND() LIMIT 2;";
    }

      conn.query(newQuery, function(newError, result, fields){
        if (newError) {
          console.log('Hubo un error en la consulta', newError.message);
          return res.status(404).send('La competencia no existe');
        }
        else {
            var response = {
              'id': id,
              'competencia': pregunta,
              'peliculas': result
            };
            res.send(JSON.stringify(response));
          }
      });
  });
}

function getMostVotedMovies(req, res){
  var id = req.params.id;

  var query = "SELECT pelicula_id, COUNT(*) as votos, p.poster, p.titulo, c.pregunta FROM voto v INNER JOIN pelicula p ON v.pelicula_id = p.id INNER JOIN competencia c ON c.id = v.competencia_id WHERE competencia_id = "+id+" AND expirationDate is NULL GROUP BY pelicula_id ORDER BY votos desc LIMIT 3";

  conn.query(query, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'competencia': resultado[0].pregunta,
        'resultados' : resultado
      };
      res.send(JSON.stringify(response));
  });
}

function addVote(req, res){
  var idCompetencia = req.params.idCompetencia;
  var idPelicula = req.body.idPelicula;

  var query = "INSERT INTO voto (pelicula_id, competencia_id) VALUES ("+idPelicula+","+idCompetencia+")";

  conn.query(query, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      else {
        var response = {
          'resultado' : "¡Éxito!"
        };
        res.send(JSON.stringify(response));
      }
  });
}

function add(req, res){
  var pregunta = req.body.nombre;
  var genero = req.body.genero;
  var director = req.body.director;
  var actor_actriz = req.body.actor;

  if (pregunta == "") {
      return res.status(422).send('¡Ingresá un nombre a la competencia!');
  }

  if (genero == 0) {
    genero = 'NULL';
  }
  if (director == 0) {
    director = 'NULL';
  }
  if (actor_actriz == 0) {
    actor_actriz = 'NULL';
  }

  var query = 'INSERT INTO competencia (pregunta, genero_id, director_id, actor_id, state) SELECT "'+pregunta+'",'+genero+','+director+','+actor_actriz+','+1+' WHERE NOT EXISTS (SELECT pregunta FROM competencia WHERE pregunta = "'+pregunta+'" AND state = 1)';

  conn.query(query, function(error, resultado, fields){
      if (resultado.affectedRows == 0) {
          return res.status(422).send('Ya existe esta competencia');
      }
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      else {
        var response = {
          'resultado' : "¡Éxito!"
        };
        res.send(JSON.stringify(response));
      }
  });
}

function deletee(req, res){
  var idCompetencia = req.params.idCompetencia;

  var query = "UPDATE voto SET expirationDate = NOW() WHERE competencia_id = '"+idCompetencia+"'";

  conn.query(query, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      else {
        var response = {
          'resultado' : "¡Éxito!"
        };
        res.send(JSON.stringify(response));
      }
  });
}

function deleteCompetencia(req, res){
  var idCompetencia = req.params.idCompetencia;

  var query = "UPDATE competencia SET state = 2 WHERE id = '"+idCompetencia+"'";

  conn.query(query, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      else {
        var response = {
          'resultado' : "¡Éxito!"
        };
        res.send(JSON.stringify(response));
      }
  });
}

function updateCompetencia(req, res){
  var idCompetencia = req.params.idCompetencia;
  var pregunta = req.body.nombre;

  var query = "UPDATE competencia SET pregunta = '"+pregunta+"' WHERE id = '"+idCompetencia+"'";

  conn.query(query, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      else {
        var response = {
          'resultado' : "¡Éxito!"
        };
        res.send(JSON.stringify(response));
      }
  });
}

function searchAllGenres(req, res){
  var sql = "SELECT * FROM genero";
  conn.query(sql, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'data': resultado
      };
      res.send(JSON.stringify(response));
  });
}

function searchAllDirectors(req, res){
  var sql = "SELECT * FROM director";
  conn.query(sql, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'data': resultado
      };
      res.send(JSON.stringify(response));
  });
}

function searchAllActors(req, res){
  var sql = "SELECT * FROM actor";
  conn.query(sql, function(error, resultado, fields){
      if (error) {
        console.log('Hubo un error en la consulta', error.message);
        return res.status(404).send('Hubo un error en la consulta');
      }
      var response = {
        'data': resultado
      };
      res.send(JSON.stringify(response));
  });
}

module.exports = {
  getOne : getOne,
  searchAll : searchAll,
  getTwoMovies : getTwoMovies,
  addVote : addVote,
  getMostVotedMovies : getMostVotedMovies,
  add : add,
  delete : deletee,
  updateCompetencia : updateCompetencia,
  deleteCompetencia : deleteCompetencia,
  searchAllGenres : searchAllGenres,
  searchAllDirectors : searchAllDirectors,
  searchAllActors : searchAllActors
}
