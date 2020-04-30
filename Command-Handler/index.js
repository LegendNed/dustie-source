const Discord = require('discord.js'),
    fs = require('fs')

class Handler {
    constructor (Client, data = {}) {
        if (!(Client instanceof Object)) throw new Error('Invalid <Client> was provided.')
        this.bot = Client
        if (!data.directory) throw new Error('No directory was provided in the config!')
        this.bot.commands = new Discord.Collection()
        this.bot.aliases = new Discord.Collection()
        this.loadCommands(data.directory)
        if (!data.prefix) throw new Error('No prefix was provided in the config')
        this.prefix = data.prefix
        this.bot.devs = data.devs || []
        Client.on('message', this._message.bind(this))
    }

    async _message(message) {
        if (message.author.bot || message.channel.type == 'dm') return
        if (!message.content.startsWith(this.prefix) || !this.prefix) return;

        let args = message.content.slice(this.prefix.length).trim().split(/ +/)
        let command = args.shift().toLowerCase()

        if (!this.bot.commands.get(command)) command = this.bot.aliases.get(command)
        if (!command) return
        else command = this.bot.commands.get(command)

        if (command.dev && !this.bot.devs.includes(message.author.id)) return
        if (command.permissions.length > 0 && !command.permissions.every(perm => message.member.hasPermission(perm))) return

        try {
            command.run(this.bot, message, args)
        } catch (err) {
            await message.channel.send(`There was an error, contact the developer!\nError: \`${err.message}\``)
            return console.error(err)
        }
    }

    loadCommands(directory) {
        let commands = fs.readdirSync(directory)
        commands.filter(f => fs.statSync(directory + f).isDirectory())
            .forEach(nestedDir => fs.readdirSync(directory + nestedDir)
                .forEach(f => commands.push(`${nestedDir}/${f}`)));
        commands = commands.filter(f => f.endsWith('.js'))
        if (commands.length < 1) throw new error(`'${directory}' has no commands within it.`)

        for (let file of commands) {
            let command = require(directory + file)
            command = new command()
            if (!command.name) throw new Error(`'${file}' is missing the command name.`)
            this.bot.commands.set(command.name, command)
            if (command.aliases) for (let alias of command.aliases) this.bot.aliases.set(alias, command.name)
        }
    }
}

module.exports.Handler = Handler