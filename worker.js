
async function streamToArrayBuffer(stream, streamSize) {
    let result = new Uint8Array(streamSize);
    let bytesRead = 0;
    const reader = stream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        result.set(value, bytesRead);
        bytesRead += value.length;
    }
    return result;
}

export default {
    async email(message, env, ctx) {
        switch (message.to) {
            default:
                const rawEmail = await streamToArrayBuffer(message.raw, message.rawSize);

                await fetch('https://beta.browser.lol/inbox', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: message.from,
                        to: message.to,
                        header: message.headers.get('subject'),
                        body: rawEmail
                    })

                });
                break;

        }
    }
}
