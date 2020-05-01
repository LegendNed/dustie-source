class Event {
    constructor () {
        this.event = 'message'
        this.enabled = true
    }
    async run(message) {
        console.log(message)
    }
}

module.exports = Event