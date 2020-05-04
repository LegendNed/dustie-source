const Discord = require('discord.js'),
    fs = require('fs')

class Handler extends Discord.Client {
    constructor (data = {}) {
        super(data);
        if (!data.prefix) throw new Error('No prefix was provided in the config')

        Object.defineProperties(this, {
            commands: {
                value: new Discord.Collection(),
                enumerable: true,
                writable: true
            },

            aliases: {
                value: new Discord.Collection(),
                enumerable: true,
                writable: true
            },

            prefix: {
                value: data.prefix,
                enumerable: true,
                writable: true
            },

            devs: {
                value: data.devs,
                enumerable: true,
                writable: true
            }
        })
        
        if (!data.directory) throw new Error('No directory was provided in the config!')

        this.loadCommands(data.directory)

        this.on('message', this._message.bind(this))
    }

    async _message(message) {
        if (message.author.bot || message.channel.type == 'dm') return
        if (!message.content.startsWith(this.prefix) || !this.prefix) return;

        let args = message.content.slice(this.prefix.length).trim().split(/ +/)
        let command = args.shift().toLowerCase()

        if (!this.commands.get(command)) command = this.aliases.get(command)
        if (!command) return
        else command = this.commands.get(command)

        if (command.dev && !this.devs.includes(message.author.id)) return
        if (command.permissions.length > 0 && !command.permissions.every(perm => message.member.hasPermission(perm))) return

        try {
            command.run(message, args)
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
            command = new command(this)
            if (!command.name) throw new Error(`'${file}' is missing the command name.`)
            this.commands.set(command.name, command)
            if (command.aliases) for (let alias of command.aliases) this.aliases.set(alias, command.name)
        }
    }
}

module.exports.Handler = Handler
