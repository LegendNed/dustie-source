class Ping {
    constructor () {
        this.name = "ping"
        this.aliases = ["clientPing"]
        this.description = "Retrieves bot ping."
        this.category = "Util"
        this.permissions = []
        this.dev = false
    }
    async run(client, message, args) {
        let botping = new Date() - message.createdAt
        let apiping = client.ws.ping

        return message.channel.send(`Bot ping: ${botping}ms\nApi ping: ${apiping}ms`)
    }
}

module.exports = Ping