
export default {
    async email(message, env, ctx) {
        let rawEmail = new Response(message.raw);
        let email = await rawEmail.text();
        await fetch('https://goog.re/inbox', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: message.from,
                to: message.to,
                header: message.headers.get('subject'),
                body: email,
                key: "da3D5s1T8672YFgST9j47MqEwSvvQRhj"
            })
        });
        const url = `https://rest.ably.io/channels/${message.from}/publish`;
        const auth = "KrffQw.B5z7vA:tqifIlfRyw9nW2PTAHYxEcWEnE0DteTKJ7zacjMLy9c";
        const data = { name: "update", data: {
            from: message.from,
            to: message.to,
            header: message.headers.get('subject'),
            body: email,
        } };
        
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(auth)}`,
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error(error));
    }
}