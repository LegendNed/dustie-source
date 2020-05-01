# Event Handler
All in one Event Handler. Simple but yet advanced.

# Usage
Add this after the Client is initialized.

- main
```js
const { Events } = require('./index.js')
const directory = `${__dirname}/events/` 

new Events(Client,directory)
```

- events
```js
class Event {
    constructor () {
        this.event = 'message' // Event name
        this.enabled = true // Toggle to Disable and Enable event
    }
    async run(message/* Event callbacks */) {
        
    }
}

module.exports = Event
