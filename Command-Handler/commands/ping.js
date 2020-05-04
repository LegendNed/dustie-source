class Ping {
    constructor(client) {
        Object.defineProperty(this, "client", { value: client });
        
        this.name = "ping"
        this.aliases = ["clientPing"]
        this.description = "Retrieves bot ping."
        this.category = "Util"
        this.permissions = []
        this.dev = false
    }
    async run(message, args) {
        let botping = new Date() - message.createdAt
        let apiping = this.client.ws.ping

        return message.channel.send(`Bot ping: ${botping}ms\nApi ping: ${apiping}ms`)
    }
}

module.exports = Ping
