import './App.css';
import Popup from './components/Popup';
import PrintBook from './components/PrintBook';
import AddBook from './components/AddBook';
import DeleteBook from './components/DeleteBook';
import { useState , useEffect} from 'react';


function App() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [books, setBooks] = useState([]); // tableau contenant les reponses de requete sql
  const [message, setMessage] = useState('');
  const [isbnDelete, setIsbnDelete] = useState('');
  const [nameDelete, setNameDelete] = useState('');
  const [messageDelete, setMessageDelete] = useState('');
  const [refreshKey, setRefreshKey] = useState(0); // Clé pour forcer la mise à jour


  // Fonction pour rafraîchir la liste des livres
  const refreshBooks = () => {
    setRefreshKey(prevKey => prevKey + 1); // Change la clé pour déclencher le useEffect
  };


  const addBook = (book) => {
    setBooks([...books, book]); // Ajouter un livre à la liste
  };

 
  //code pour supprimer des livres de la BD
  const noreload = async (event) => {
      event.preventDefault();

      if(!isbnDelete && !nameDelete){
        console.log('il faut un isbn et un nom pour pouvoir supprimer un livre');
      }else if(isbnDelete && !nameDelete || isbnDelete && nameDelete){ //ici on a l'isbn donc on supprime directement car il est unique
        const response = await fetch('http://localhost:5001/api/books', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({isbnDelete, nameDelete}), // Envoi des données sous forme de JSON
        });

        if (response.ok){
          const result = await response.json();
          setMessageDelete('livre supprimé');
          //window.location.reload(); // recharge la page actuelle
        } else {
          const result = await response.json();
          const errorMessage = result.error || 'Erreur lors de la suppression du livre'; // Utilise l'erreur du backend ou un message par défaut
          setMessageDelete(errorMessage);
        }
      }else if(!isbnDelete && nameDelete){ //ici on veut supprimer avec le nom donc on est obligé de faire 2 requete 
        //une pour selectionner les livres correspondant et l'autre pour supprimer le livre selectionner dans le popup 
          /*fetch('http://localhost:5001/api/books/selectForDelete')
            .then(reponse => {
              if(!reponse.ok) {
                throw new Error('Erreur lors de la recup des livres pour les supprimer');
              }else{
                const response = await fetch('http://localhost:5001/api/books', {
                  method: 'DELETE',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({isbnDelete, nameDelete}), // Envoi des données sous forme de JSON
                });
              }
              console.log('livre supprimé apres selection');
              return reponse.json();
            })
            .then(data => {
              if (data.length == 1){
                  console.log('livre supprimé apres selection');
              }
            })
            .catch(error =>{
              console.error('erreur : ', error);
            });*/
      }
    // Réinitialisation des champs du formulaire
    setNameDelete('');
    setIsbnDelete('');
  }

  



    //code pour ajouté un livre
  const handleSubmit = async ({ name, isbn, date }) => {
    // Vérifie si tous les champs sont remplis
    if (!name || !isbn) {
      setMessage('Tous les champs sont obligatoires');
      return;
    }
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


  return (
    <div className="App">
      <main>
      <h1 className='hello'> Bienvenue dans la librairie ! </h1>
        <button onClick={() => setButtonPopup(true)}>Oppen button</button>
        <h2 className='liste livre'> Liste des livres </h2>
        <PrintBook onRefresh={refreshBooks} key={refreshKey}> 
        </PrintBook>

        <AddBook 
          onSubmit={handleSubmit} 
          message={message} 
        />


        <DeleteBook 
          rechargement={noreload} 
          isbnDelete={isbnDelete} 
          nameDelete={nameDelete} 
          setIsbnDelete={setIsbnDelete} 
          setNameDelete={setNameDelete}
          messageDelete={messageDelete}>
        </DeleteBook>

      </main>

       

        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}> 
          <h3> My popup </h3>
        </Popup>
    </div>
  );
}

export default App;


