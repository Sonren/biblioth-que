const {Client} =require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const client = new Client({//to connect in the database
    user: 'sonren',
    host: 'localhost',
    database: 'library',
    password: 'les db sont c0ol',
    port: 5432,
});


(async () =>{
    try{

        //function to check the correct format of the isbn  
        const isValidIsbn = (isbn) => {
            // Retirer les tirets ou espaces
            isbn = isbn.replace(/[\s-]/g, '');  
            
            if (isbn.length === 13) { //pour un isbn de 13 TODO isbn a 10
                let sum = 0;
                for (let i = 0; i < 13; i++) {
                    const digit = parseInt(isbn[i], 10); // change the char to int in decimal (base 10)
                    if (isNaN(digit)){// Vérifier que tous sont des chiffres
                        console.log('ce ne sont pas des nombres');
                        return false ; 
                    } 
                    sum += digit * (i % 2 === 0 ? 1 : 3); //the int are multiply by 1 or 3 depends of the parity of the emplacement in ISBN
                }
                return sum % 10 === 0;
            }
        
            return false; // Longueur invalide
        }

        await client.connect();
        console.log('Connected to the database');

//-----------------------PRINT TABLE IN THE APPLICATION--------------------------------------------------------------------------------------
        //pour opouvoir afficher le tableau des livres disponibles
        app.get('/api/books', async (req,res) => {
            try{
                const result = await client.query('SELECT isbn, name, date FROM books');
                res.json(result.rows);//we send all the rows selest in the database
            } catch (err) {
                res.status(500).json({ error: 'erreur lors de la recuperation de données'});
            }
        });

//----------------------------ADD BOOKS TO THE DATABASE------------------------------------------------------------------------------------------------

        //pour pouvoir ajouter un livre avec toute ses caractéristiques TODO gerer l'insertion sans date
        app.post('/api/books', async (req,res) => {
            const { name, date, isbn } = req.body; // On récupère les données envoyées par le frontend
            if(!name || ! isbn){//we check that the request has a ISBN and a name
                res.status(400).json({ error: 'Veuillez fournir un nom et un isbn'});
            }
            if(!isValidIsbn(isbn)){// we check the validity of the ISBN
                return res.status(400).json({ error: "ISBN invalide"});
            }else {
                try{
                    const result = await client.query('INSERT INTO books (isbn, name, date) VALUES ($1, $2, $3) RETURNING *',[isbn, name, date]);
                    res.status(201).json(result.rows[0]); // Réponse avec les données du livre inséré
                } catch (err) {
                    res.status(500).json({ error: 'Erreur lors de l\'ajout du livre' });
                }
            }
        });

//--------------------------------DELETE IN DATABASE----------------------------------------------------------------------------------------------------------------
       
        //fonction pour pouvoir delete un livre par son isbn
        app.delete('/api/book/:isbn', async (req, res) => {
            const isbn = decodeURIComponent(req.params.isbn); // Récupère l'ISBN de l'URL
            console.log('Paramètres reçus :', isbn);

            if(!isbn){ //we check that the request has a ISBN
                return res.status(400).json({ error: "ISBN requis pour supprimer un livre"});
            }

            if(!isValidIsbn(isbn)){// we check the validity of the ISBN
                return res.status(400).json({ error: "ISBN invalide"});
            }

            try{
                const result = await client.query('DELETE FROM books WHERE isbn = $1 RETURNING *', [isbn]);
                
                if (result.rowCount === 0) { //we check if the request send us back a response
                    return res.status(404).json({ error: 'Livre non trouvé' });
                }

                res.status(200).json(result.rows[0]);
                
            } catch(err) {
                res.status(500).json({ error: 'Erreur lors de la suppression du livre'});
            }
            
        });

        //pour pouvoir recuperer la liste des livres a supprimer 
        /*app.get('/api/books/selectForDelete', async (req,res) => {
            const {nameDelete} = req.body;
            try{
                const result = await client.query('SELECT * FROM books WHERE name = $1', [nameDelete]);
                if (result.rowCount === 0) {
                    return res.status(404).json({ error: 'Livre non trouvé' });
                }else if(result.rowCount === 1){
                    res.status(200).json(result.rows[0]);
                }else{
                    res.json(result.rows);
                }
            }catch(err){
                res.status(500).json({ error: 'Erreur lors de la suppression du livre'});
            }
        });*/


    
//--------------------------START AND STOP FOR THE SERVER---------------------------------------------------------------------------------------------

        //demarage du serveur 
        const server = app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });

        // Gestion des signaux pour un arrêt propre
        const shutdown = async (signal) => {
            console.log(`Signal reçu : ${signal}`);
            console.log('Fermeture des connexions et du serveur...');

            // Fermeture des connexions à la base de données
            try {
                await client.end();
                console.log('Connexion PostgreSQL fermée.');
            } catch (err) {
                console.error('Erreur lors de la fermeture de PostgreSQL :', err);
            }

            // Fermeture du serveur HTTP
            server.close(() => {
                console.log('Serveur arrêté proprement.');
                process.exit(0); // Arrêt du processus proprement
            });
        };

        // Écouter les signaux d'arrêt
        process.on('SIGINT', () => shutdown('SIGINT')); // Ctrl+C
        process.on('SIGTERM', () => shutdown('SIGTERM')); // Docker stop ou gestionnaire d'arrêt
        process.on('SIGTSTP', () => {
            console.log('Signal SIGTSTP reçu. Le processus ne sera pas suspendu.');
            shutdown('SIGTSTP'); //ctrl+z
        });

    }catch (err) {
        console.error('Erreur de connexion ou de requête', err.stack);
    } 
})();

