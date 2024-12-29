const {Client} =require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const client = new Client({
    user: 'sonren',
    host: 'localhost',
    database: 'library',
    password: 'les db sont c0ol',
    port: 5432,
});


(async () =>{
    try{
        await client.connect();
        console.log('Connected to the database');

        app.get('/api/books', async (req,res) => {
            const {isbnDelete, nameDelete} = req.body;
            try{
                const result = await client.query('SELECT isbn, name, date FROM books');
                res.json(result.rows);
            } catch (err) {
                res.status(500).json({ error: 'erreur lors de la recuperation de données'});
            }
        });

        app.post('/api/books', async (req,res) => {
            const { name, date, isbn } = req.body; // On récupère les données envoyées par le frontend
            if(!name || ! isbn){
                res.status(400).json({ error: 'Veuillez fournir un nom et un isbn'});
            }else {
                try{
                    const result = await client.query('INSERT INTO books (isbn, name, date) VALUES ($1, $2, $3) RETURNING *',[isbn, name, date]);
                    res.status(201).json(result.rows[0]); // Réponse avec les données du livre inséré
                } catch (err) {
                    res.status(500).json({ error: 'Erreur lors de l\'ajout du livre' });
                }
            }
        });

        app.delete('/api/books', async (req,res) =>{
            const {isbnDelete, nameDelete} = req.body;
            if(!isbnDelete && !nameDelete){
                return res.status(400).json({ error: "ISBN ou nom requis pour supprimer un livre"});
            }else if(isbnDelete && !nameDelete || isbnDelete && nameDelete){
                try{
                    const result = await client.query('DELETE FROM books WHERE isbn = $1 RETURNING *', [isbnDelete]);
                    res.status(200).json(result.rows[0]);

                    if (result.rowCount === 0) {
                        return res.status(404).json({ error: 'Livre non trouvé' });
                    }
                    
                } catch(err) {
                    res.status(500).json({ error: 'Erreur lors de la suppression du livre'});
                }
            }else if (!isbnDelete && nameDelete){
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
            }
        });

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

    }catch (err) {
        console.error('Erreur de connexion ou de requête', err.stack);
    } 
})();

