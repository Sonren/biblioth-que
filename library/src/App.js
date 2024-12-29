import './App.css';
import Popup from './components/Popup';
import PrintBook from './components/printBook';
import AddBook from './components/addBook';
import DeleteBook from './components/DeleteBook';
import { useState , useEffect} from 'react';


function App() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [books, setBooks] = useState([]); // tableau contenant les reponses de requete sql
  const [isbn, setIsbn] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [isbnDelete, setIsbnDelete] = useState('');
  const [nameDelete, setNameDelete] = useState('');
  const [messageDelete, setMessageDelete] = useState('');

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
        console.log("donné bien recu");
      })
      .catch(error =>{
        console.error('erreur : ', error);
      });
  }, []);
 
  const noreload = async (event) => {
      event.preventDefault();

      if(!isbnDelete && !nameDelete){
        console.log('il faut un isbn et un nom pour pouvoir supprimer un livre');
      }else if(isbnDelete && !nameDelete || isbnDelete && nameDelete){
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
          window.location.reload(); // recharge la page actuelle
        } else {
          const result = await response.json();
          const errorMessage = result.error || 'Erreur lors de la suppression du livre'; // Utilise l'erreur du backend ou un message par défaut
          setMessageDelete(errorMessage);
        }
      }else if(!isbnDelete && nameDelete){
        const response = await fetch('http://localhost:5001/api/books', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({isbnDelete, nameDelete}), // Envoi des données sous forme de JSON
        });

        if (response.ok){
          const result = await response.json();
          if(result.rowCount == 1){
            const responseDelete = await fetch('http://localhost:5001/api/books', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({isbnDelete}), // Envoi des données sous forme de JSON
            });

            if (responseDelete.ok){
              const result = await response.json();
              setMessageDelete('livre supprimé');
              window.location.reload(); // recharge la page actuelle
            } else {
              const result = await response.json();
              const errorMessage = result.error || 'Erreur lors de la suppression du livre'; // Utilise l'erreur du backend ou un message par défaut
              setMessageDelete(errorMessage);
            }
          }
          setMessageDelete('livre supprimé');
          window.location.reload(); // recharge la page actuelle
        } else {
          const result = await response.json();
          const errorMessage = result.error || 'Erreur lors de la suppression du livre'; // Utilise l'erreur du backend ou un message par défaut
          setMessageDelete(errorMessage);
        }
      }
    // Réinitialisation des champs du formulaire
    setNameDelete('');
    setIsbnDelete('');
  }

  

 //code pour ajouté un livre
  const handleSubmit = async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    // Vérification des champs
    if (!name || !isbn ) {
      setMessage('Tous les champs sont obligatoires');
      return;
    }
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
      window.location.reload(); // recharge la page actuelle
    } else {
      setMessage('Erreur lors de l\'ajout du livre');
    }

    // Réinitialisation des champs du formulaire
    setName('');
    setIsbn('');
    setDate('');
  }


  return (
    <div className="App">
      <main>
      <h1 className='hello'> Bienvenue dans la librairie ! </h1>
        <button onClick={() => setButtonPopup(true)}>Oppen button</button>
        <h2 className='liste livre'> Liste des livres </h2>
        <PrintBook 
          books ={books} > 
        </PrintBook>

        <AddBook 
          rechargement={handleSubmit} 
          date = {date} 
          name = {name} 
          isbn={isbn} 
          setName={setName} 
          setIsbn={setIsbn} 
          setDate={setDate} 
          message={message}>
        </AddBook>

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


