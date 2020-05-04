# Command Handler
All in one Command Handler, with most features anyone requires.

# Usage
Add this to your ready event.

```js
const { Handler } = require('index.js')
const options = {
    directory: `${__dirname}/commands/`,
    devs: ['157945195931893761'],
    prefix: "!"
}

const client = new Handler(options)

client.login(/* token */)
```
