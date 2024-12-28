import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';


function HelloWorld(){
  const [books, setBooks] = useState([]); // tableau contenant les reponses de requete sql 

  useEffect(() => {
    fetch('http://localhost:5001/api/books')
      .then(reponse => {
        if(!reponse.ok) {
          throw new Error('Erreur lors de la recup des livres');
        }
        return reponse.json();
      })
      .then(data => {
        setBooks(data);
        console.log(data);
      })
      .catch(error =>{
        console.error('erreur : ', error);
      });
  }, []);


  return (
    <div>
    <h1 className='hello'> Bienvenue dans la librairie !</h1>
    <h2 className='l_livre'> Liste des livres </h2>
    <ul>
      {books.length > 0 ?(
        books.map(book => (
        <li key={book.isbn}>
          {book.name} sortie le : {new Date(book.date).toLocaleDateString('fr-FR')} (numéro ISBN : {book.isbn})
        </li>
        ))
      ):(
        <li className='indisponobilité'>Aucun livre disponible.</li>
      )}
    </ul>
    <h2 className='ajout'> Ajouter des livres </h2>
    <AddBook />
   </div>
  
  )

}

function AddBook(){

  const [isbn, setIsbn] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Vérification des champs
    if (!name || !isbn ) {
      setMessage('Tous les champs sont obligatoires');
      return;
    }
    // Envoi des données du formulaire à l'API backend
    const response = await fetch('http://localhost:5001/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, isbn, date }), // Envoi des données sous forme de JSON
    });

    if (response.ok) {
      const result = await response.json();
      setMessage(`Livre ajouté : ${result.name}`);
    } else {
      setMessage('Erreur lors de l\'ajout du livre');
    }

    // Réinitialisation des champs du formulaire
    setName('');
    setIsbn('');
    setDate('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom du livre :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>ISBN :</label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de publication :</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Ajouter le livre</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddBook;



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelloWorld />
  </React.StrictMode>
);

reportWebVitals();
