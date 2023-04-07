export default {
    async email(message, env, ctx) {
        switch (message.to) {
            default:
                const rawStream = message.raw;
                const reader = rawStream.getReader();
                let rawContent = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        console.log(rawContent);
                        return;
                    }
                    rawContent += new TextDecoder("utf-8").decode(value);
                    await fetch(`https://goog.re/inbox?from=${message.from}&to=${message.to}&header=${message.headers.get("subject")}&body=${rawContent}`);
                    break;

                }
        }
    }
}