PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE profesores (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL
) STRICT;
CREATE TABLE materias (
  clave TEXT NOT NULL PRIMARY KEY,
  nombre TEXT NOT NULL
) STRICT;
CREATE TABLE materias_profesores (
  id_profesor INTEGER NOT NULL,
  clave_materia TEXT NOT NULL,
  FOREIGN KEY (id_profesor) REFERENCES profesores(id),
  FOREIGN KEY (clave_materia) REFERENCES materias(clave)
) STRICT;
CREATE TABLE recomendaciones (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  id_profesor INTEGER NOT NULL,
  comentario TEXT NOT NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion >= 0 AND calificacion <= 10),
  facilidad INTEGER NOT NULL CHECK (facilidad >= 0 AND facilidad <= 10),
  FOREIGN KEY (id_profesor) REFERENCES profesores(id)
) STRICT;
CREATE TABLE etiquetas (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  descripcion TEXT NOT NULL
) STRICT;
CREATE TABLE etiquetas_recomendaciones (
  id_etiqueta INTEGER NOT NULL,
  id_recomendacion INTEGER NOT NULL,
  FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id),
  FOREIGN KEY (id_recomendacion) REFERENCES recomendaciones(id)
) STRICT;
DELETE FROM sqlite_sequence;
COMMIT;
