import './App.css';
import Popup from './components/Popup';
import PrintBook from './components/printBook';
import { useState , useEffect} from 'react';


function App() {
  const [buttonPopup, setButtonPopup] = useState(false);
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
        console.log("donné bien recu");
      })
      .catch(error =>{
        console.error('erreur : ', error);
      });
  }, []);

  return (
    <div className="App">
      <main>
      <h1 className='hello'> Bienvenue dans la librairie ! </h1>
        <button onClick={() => setButtonPopup(true)}>Oppen button</button>
        <h2 className='l_livre'> Liste des livres </h2>
      </main>

        <PrintBook books ={books} > </PrintBook>

        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}> 
          <h3> My popup </h3>
        </Popup>
    </div>
  );
}

export default App;


