-- Supprimer la table si elle existe déjà, pour éviter des conflits
DROP TABLE IF EXISTS books;

-- Création de la table books
CREATE TABLE books (
    isbn VARCHAR(17) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    date DATE
);

