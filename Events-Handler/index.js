const fs = require('fs')

class Events {
    constructor (Client, directory) {
        if (!(Client instanceof Object)) throw new Error('Invalid <Client> was provided.')
        this.bot = Client
        if (!fs.statSync(directory).isDirectory()) throw new Error('Invalid Events directory provided.')
        this.loadEvents(directory)
    }

    loadEvents(directory) {
        fs.readdir(directory, (err, files) => {
            if (err) throw err

            let filter = files.filter(file => file.split(/.+/).pop() === 'js')
            for (let file of files) {
                let event = require(`${directory}/${file}`)
                event = new event()
                if (!event.event) throw new Error('No event name was provided')
                if (!event.enabled) continue
                this.bot.on(event.event, event.run.bind(this))
            }
        })
    }
}

module.exports.Events = Events