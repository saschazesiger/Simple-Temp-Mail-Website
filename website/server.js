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
  console.log("New Email")

    if (req.body.key !== process.env.privatekey) {
        return res.status(403).send();
    }

    const parsedbody = await simpleParser(req.body.body)

    const sql = `INSERT INTO mail (sender, receiver, date, header, body) VALUES ("${parsedbody.from.text}", "${req.body.to}", NOW(), "${parsedbody.subject}", "${parsedbody.html.replaceAll('"', "'")}")`;


    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        };
        return res.status(404).send();
    });
});



app.get('/api/mail', (req, res) => {
    const email = req.query.email;

    const date = req.query.lastdate;
    
    
    newdate = new Date(date)
    newdate.setHours(newdate.getHours() - 2);
    const mysqlDate = newdate.toISOString().slice(0, 19).replace('T', ' ');

  
    // SQL-Abfrage, um E-Mail-Daten abzurufen
    const sql = `SELECT id,sender, receiver, header, body, date FROM mail WHERE receiver='${email}' AND date > '${mysqlDate}' ORDER BY date DESC LIMIT 50`;
  
    // Datenbankabfrage ausführen
    connection.query(sql, (error, results, fields) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: '0' });
        return;
      }
  
      // Überprüfen Sie, ob Daten gefunden wurden
      if (results.length === 0) {
        res.json([]);
        return;
      }
  
      // Extrahieren Sie die Daten aus der Abfrageergebnissen
      const data = results;
  
      // Senden Sie das JSON-Objekt mit den abgerufenen Daten zurück
      res.json(data);
    });
  });
  


app.listen(5000, () => {
    console.log('Server started on port 5000');
});



