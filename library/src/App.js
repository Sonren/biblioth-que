import './App.css';
import Popup from './components/Popup';
import PrintBook from './components/PrintBook';
import AddBook from './components/AddBook';
import DeleteBook from './components/DeleteBook';
import { useState , useEffect} from 'react';


function App() {
  const [books, setBooks] = useState([]); // tableau contenant les reponses de requete sql
  const [message, setMessage] = useState('');
  const [messageDelete, setMessageDelete] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer la mise à jour


  // Fonction pour rafraîchir la liste des livres
  const refreshBooks = () => {
    setRefreshKey(prevKey => prevKey + 1); // Change la clé pour déclencher le useEffect
  };

//---------------ADD A BOOK ON THE TABLE-------------------------------------------------------------------------------------------------------------

  const addBook = (book) => {
    setBooks([...books, book]); // Ajouter un livre à la liste
  };


  //code pour ajouté un livre
  const handleSubmit = async ({ name, isbn, date }) => {
    // Vérifie si tous les champs sont remplis

      try{
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
          //addBook(result);
          refreshBooks(); // Met à jour la liste
        } else {
          setMessage('Erreur lors de l\'ajout du livre');
        }
      } catch(error){
        setMessage("erreur de saisie");
      }
  }
 

//-----------------------------DELETE A BOOK IN THE TABLE---------------------------------------------------------------------------------------------------

  //code pour supprimer des livres de la BD
  const handleDeleteWithIsbn = async (isbn, name) => {

    try{
      //voir pour rajouter des tokens de connexion 
      const encodeISBN = encodeURIComponent(isbn);
      const response = await fetch(`http://localhost:5001/api/book/${encodeISBN}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessageDelete(`Livre supprimé avec succès.`);
        // Rafraîchir les livres après suppression
        refreshBooks(); // TODO faire un affichage qui s'affiche que quelques secondes faire threads dans une fonction
      } else {
        setMessageDelete('Erreur lors de la suppression du livre.');
      }
    } catch (error) {
      setMessageDelete('Une erreur s\'est produite.');
    }
  }


  return (
    <div className="App">
      <main>
      <h1 className='hello'> Bienvenue dans la librairie ! </h1>
        <h2 className='liste livre'> Liste des livres </h2>
        <PrintBook 
          onRefresh={refreshBooks} 
          key={refreshKey}> 
        </PrintBook>

        <AddBook 
          onSubmit={handleSubmit} 
          message={message} 
          setMessage={setMessage}
        />


        <DeleteBook 
          onDeleteWithIsbn={handleDeleteWithIsbn}
          setMessageDelete={setMessageDelete}
          messageDelete={messageDelete}>
        </DeleteBook>

      </main>
    </div>
  );
}

export default App;


