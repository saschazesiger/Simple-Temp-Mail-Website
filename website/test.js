const fetch = require('node-fetch');

const api_key = 'KrffQw.B5z7vA:tqifIlfRyw9nW2PTAHYxEcWEnE0DteTKJ7zacjMLy9c';
const channel_name = 'getting-started';

fetch(`https://rest.ably.io/channels/${channel_name}/publish`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
    },
    body: JSON.stringify({
        name: 'update',
        data: {
            message: 'Hello World!'
        }
    })
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        console.log('Message published successfully');
    })
    .catch(error => {
        console.error('Error publishing message:', error);
    });