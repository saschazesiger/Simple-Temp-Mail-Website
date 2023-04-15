// Import required Node.js modules
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const env = require('dotenv').config();
const simpleParser = require('mailparser').simpleParser;
const engines = require('consolidate');

// Create an instance of the Express application
const app = express();

// Set up middleware to parse incoming requests with JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a connection to the MySQL database using environment variables
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: 3306,
    ssl: {}
});

// Serve static files from the public directory
app.use(express.static(__dirname + '/public'));


// Define a POST route for handling incoming emails
app.post('/inbox', async (req, res) => {
    console.log("New Email");

    // Check if the private key in the request payload matches the one in the environment variables
    if (req.body.key !== process.env.privatekey) {
        return res.status(403).send();
    }

    // Parse the email data in the request payload using mailparser
    const parsedbody = await simpleParser(req.body.body)

    // Construct an SQL INSERT statement to insert the email data into the MySQL database
    const sql = `INSERT INTO mail (sender, receiver, date, header, body) VALUES ("${parsedbody.from.text}", "${req.body.to}", NOW(), "${parsedbody.subject}", "${parsedbody.html.replaceAll('"', "'")}")`;

    // Execute the SQL statement using the MySQL connection
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        };
        return res.status(404).send();
    });
});

// Define a GET route for fetching email data
/*app.get('/api/mail', (req, res) => {
    const email = req.query.email;
    const date = req.query.lastdate;
    
    // Subtract two hours from the last date and convert it to a MySQL datetime string
    newdate = new Date(date)
    console.log(newdate,(new Date()))

    const mysqlDate = newdate.toISOString().slice(0, 19).replace('T', ' ');

    // Construct an SQL SELECT statement to fetch email data from the MySQL database
    const sql = `SELECT id,sender, receiver, header, body, date FROM mail WHERE receiver='${email}' AND date > '${mysqlDate}' ORDER BY date DESC LIMIT 50`;
  
    // Execute the SQL statement using the MySQL connection
    connection.query(sql, (error, results, fields) => {
        if (error) {
            console.log(error)
            res.status(500).json({ error: '0' });
            return;
        }

        // Check if any email data was found
        if (results.length === 0) {
            res.json([]);
            return;
        }

        // Extract email data from the query results
        const data = results;
        console.log(data)
        // Send the email data as a JSON response
        res.json(data);
    });
});*/

// Start the server on port 5000 and log a message to the console
app.listen(5000, () => {
    console.log('Server started on port 5000');
});