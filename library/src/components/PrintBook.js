import React, { useState, useEffect } from 'react';

function PrintBook({ onRefresh }) { // Nom du composant avec une majuscule

    // États internes pour stocker les livres et gérer le rafraîchissement
    const [books, setBooks] = useState([]);

    // Fonction pour récupérer les livres depuis l'API
    const fetchBooks = () => {
        fetch('http://localhost:5001/api/books')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des livres');
                }
                return response.json();
            })
            .then(data => {
                setBooks(data); // Met à jour les livres dans l'état
                console.log("Données bien reçues");
            })
            .catch(error => {
                console.error('Erreur : ', error);
            });
    };

    // useEffect pour charger les livres au montage ou après rafraîchissement
    useEffect(() => {
        fetchBooks(); // Appelle fetchBooks à chaque changement de refresh
    }, [onRefresh]);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Titre</th>
                        <th>Date de sortie</th>
                        <th>ISBN</th>
                    </tr>
                </thead>
                <tbody>
                    {books.length > 0 ? (
                        books.map((book) => (
                            <tr key={book.isbn}>
                                <td>{book.name}</td>
                                <td>{new Date(book.date).toLocaleDateString('fr-FR')}</td>
                                <td>{book.isbn}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                                Aucun livre disponible.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PrintBook; // Export avec une majuscule