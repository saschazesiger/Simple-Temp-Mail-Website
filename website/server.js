const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const simpleParser = require('mailparser').simpleParser;
const engines = require('consolidate'); // Importiere die consolidate-Abhängigkeit



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: 3306,
    ssl: {}
});

app.use(express.static(__dirname + '/public'));


app.post('/inbox', async (req, res) => {

    if (req.body.key !== process.env.privatekey) {
        return res.status(403).send();
    }

    const parsedbody = await simpleParser(req.body.body)
    console.log(parsedbody.subject);

    const sql = `INSERT INTO mail (sender, receiver, date, header, body) VALUES ("${req.body.from}", "${req.body.to}", NOW(), "${parsedbody.subject}", "${parsedbody.html.replaceAll('"', "'")}")`;


    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        };
        return res.status(404).send();
    });
});


app.get('/verify', (req, res) => {
    const fetch = require('node-fetch');
    const FormData = require('form-data');

    const SECRET_KEY = '0x4AAAAAAAD1kzJrMMJSELNDxU1QDEPNva4';

    async function verifyToken(token, ip) {
        const formData = new FormData();
        formData.append('secret', SECRET_KEY);
        formData.append('response', token);
        formData.append('remoteip', ip);

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const response = await fetch(url, { method: 'POST', body: formData });

        const result = await response.json();

        if (result.success) {
            console.log('Token verified successfully');
            // Do something if the token is valid
        } else {
            console.log('Token verification failed');
            // Do something if the token is invalid
        }
    }

    // Example usage
    const token = 'example_token';
    const ip = '127.0.0.1';
    verifyToken(token, ip);
});

app.get('/api/mail', (req, res) => {
    const email = req.query.email;
    const date = req.query.date;
  
    // SQL-Abfrage, um E-Mail-Daten abzurufen
    const sql = `SELECT sender, receiver, header, body, date FROM mail WHERE receiver='${email}' AND date > ${date} ORDER BY date DESC LIMIT 50`;
  
    // Datenbankabfrage ausführen
    connection.query(sql, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Datenbankfehler' });
        return;
      }
  
      // Überprüfen Sie, ob Daten gefunden wurden
      if (results.length === 0) {
        res.status(404).json({ error: 'E-Mail-Daten nicht gefunden' });
        return;
      }
  
      // Extrahieren Sie die Daten aus der Abfrageergebnissen
      const data = results;
  
      // Senden Sie das JSON-Objekt mit den abgerufenen Daten zurück
      console.log(data)
      res.json(data);
    });
  });
  


app.listen(5000, () => {
    console.log('Server started on port 5000');
});



