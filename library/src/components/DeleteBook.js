import React, { useState } from 'react';

function DeleteBook({ onDeleteWithIsbn, setMessageDelete, messageDelete }) {
  const [isbnDelete, setIsbnDelete] = useState('');
  const [nameDelete, setNameDelete] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Empêche le rechargement de la page
    if (!isbnDelete && !nameDelete) {
      setMessageDelete('il faut un isbn ou un nom pour pouvoir supprimer un livre');
      return;
    }
    if (isbnDelete && !nameDelete || isbnDelete && nameDelete){
      //ici on a l'isbn donc on supprime directement car il est unique
      onDeleteWithIsbn(isbnDelete, nameDelete);
    }
    if (!isbnDelete && nameDelete){
      //TODO voir brouillon 
      setMessageDelete('supprimer le livre par son nom');
    } 

    setIsbnDelete('');
    setNameDelete('');
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            <label> Isbn du livre a suppripmer </label>
            <input 
            type="text" 
            value={isbnDelete} 
            onChange={(e) => setIsbnDelete(e.target.value)}/>
        </div>
        <div>
          <label>Nom du livre :</label>
          <input
            type="text"
            value={nameDelete}
            onChange={(e) => setNameDelete(e.target.value)}
          />
        </div>
        <button type="submit" disabled={!isbnDelete && !nameDelete}>supprimer le livre</button>
      </form>
      {messageDelete && <p>{messageDelete}</p>}
    </div>
  )
}

export default DeleteBook
