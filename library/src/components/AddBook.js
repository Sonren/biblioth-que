import React, { useState } from 'react';

const AddBook = ({ onSubmit, message, setMessage }) => {
  // États internes pour les valeurs du formulaire
  const [name, setName] = useState('');
  const [isbn, setIsbn] = useState('');
  const [date, setDate] = useState('');
  
  const handleSubmit = (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    if (!name || !isbn) {
      setMessage('Tous les champs sont obligatoires');
      return;
    }
    onSubmit({ name, isbn, date }); // Passe les données au parent
    setName('');
    setIsbn('');
    setDate('');
  };

  return (<div>
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
