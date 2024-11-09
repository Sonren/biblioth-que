const {Client} =require('pg');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;

app.use(cors());

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
        const result = await client.query('SELECT isbn, name, date FROM book');
        console.log(result.rows);



        app.get('/api/books', async (req,res) => {
            try{
                const result = await client.query('SELECT isbn, name, date FROM book');
                res.json(result.rows);
            } catch (err) {
                res.status(500).json({ error: 'erreur lors de la recuperation de données'});
            }/* finally {
                await wait(20000);
                await client.end();
                console.log('connexion fermée');
                server.close(() =>{
                console.log('server fermé');
                });
            }*/
        });
        const server = app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });


    }catch (err) {
        console.error('Erreur de connexion ou de requête', err.stack);
    } 
})();

