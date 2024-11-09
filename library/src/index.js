import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';


function HelloWorld(){
  const [books, setBooks] = useState([]);

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
          {book.name} - {new Date(book.date).toLocaleDateString('fr-FR')} 
        </li>
        ))
      ):(
        <li className='indisponobilité'>Aucun livre disponible.</li>
      )}
      </ul>

   </div>
  )

}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelloWorld />
  </React.StrictMode>
);

reportWebVitals();
