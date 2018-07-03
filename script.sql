-- USE COMPETENCIAS;
--
-- CREATE TABLE competencia(
--   id INT NOT NULL auto_increment,
--   pregunta VARCHAR(500),
--   PRIMARY KEY (id)
-- )

-- CREATE TABLE voto(
--   id INT NOT NULL auto_increment,
--   pelicula_id INT unsigned NOT NULL,
--   competencia_id INT NOT NULL,
--   PRIMARY KEY (id),
--   FOREIGN KEY (pelicula_id) REFERENCES pelicula(id),
--   FOREIGN KEY (competencia_id) REFERENCES competencia(id)
-- )

-- ALTER TABLE voto ADD COLUMN expirationDate DATETIME;

-- ALTER TABLE competencia ADD COLUMN genero_id INT unsigned;
-- ALTER TABLE competencia ADD FOREIGN KEY (genero_id) REFERENCES genero(id);

-- ALTER TABLE competencia ADD COLUMN director_id INT unsigned;
-- ALTER TABLE competencia ADD FOREIGN KEY (director_id) REFERENCES director(id);
--
-- ALTER TABLE competencia ADD COLUMN actor_id INT unsigned;
-- ALTER TABLE competencia ADD FOREIGN KEY (actor_id) REFERENCES actor(id);

--ALTER TABLE competencia ADD COLUMN state INT;

--INSERT INTO competencia(pregunta, genero_id, state) VALUES("¿Cuál es la mejor comedia?", 5, 1), ("¿Cuál es el peor drama?", 8, 1), ("¿Cuál es la peli de terror que más te asustó?", 10, 1);
