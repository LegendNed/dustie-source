# Message Tracker
This message tracker uploads all the message information to MongoDB

## Usage
Used outside the ready event!

```js
const { Run } = require('./index.js')
const database = 'mongodb+srv://username:password@server/test?retryWrites=true&w=majority'

new Run(Client,database)
```
