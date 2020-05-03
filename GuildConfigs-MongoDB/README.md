# Per-Guild config - MongoDB
Simple per guild config for MongoDB, simple simple simple!

# Usage
Add this after the Client is initialized.

**Schema** must be defined before applying any functions!

- main
```js
const Discord = require('discord.js'),
    client = new Discord.Client(),

const { Database } = require('./index.js')
client.db = new Events(Client,directory)

client.login(/* Token */)
```

- Examples
```js
// Creating a document for a guild:
await client.db.create(GuildID)

//Deleting a guild's document:
client.db.delete(GuildID)

// Setting a value in the guilds document:
client.db.set(GuildID,path,value)
client.db.set(GuildID,'prefix','>')
// To travel multiple paths use 'object.other.value'
// Using arrays: 'array.0' - 0 is the index

// Getting a value from a guilds document:
await client.db.get(GuildID,path)
await client.db.get(GuildID,'prefix')
// To get the whole document, ignore path
// To travel multiple paths use 'object.other.value'
// Using arrays: 'array.0' - 0 is the index

// 'await' not necessary for 'set' or 'delete' but preferred if it was used!
```