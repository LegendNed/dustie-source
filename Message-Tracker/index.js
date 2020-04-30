const mongoose = require('mongoose'); console.log('-----------------------------------------\nYou\'ve ran Neds sexy script ༼ つ ◕_◕ ༽つ\n-----------------------------------------')

class Tracker {
    constructor (bot, connection) {
        if (!(bot instanceof Object)) throw new Error('Invalid <Client> was provided.')
        if (typeof (connection) !== 'string') throw new Error('Invalid MongoDB URL was provided!')
        this.bot = bot
        this.initDB(connection)
        this.login()
        this.message()
    }
    async initDB(connection) {
        mongoose.connect(connection, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('connected', () => {
            process.stdout.write('Database Online | ')
        }); mongoose.connection.on('err', (err) => console.error)

        this.database = mongoose.model('messages', mongoose.Schema({
            guildID: String,
            messageID: String,
            messageURL: String,
            authorID: String,
            content: String,
            embeds: Array,
            attachments: Array,
            createdAt: Date
        }))
    }

    login() {
        this.bot.on('ready', () => {
            process.stdout.write(`Bot Online | ${(new Date()).toISOString().substr(11).replace(/\..+/, '')}`)
        })
    }

    message() {
        this.bot.on('message', (message) => {
            let data = new Object()
            message.guild ? data['guildID'] = message.guild.id : null
            data['messageID'] = message.id
            data['messageURL'] = message.url
            data['authorID'] = message.author.id
            message.content ? data['content'] = message.content : null
            message.embeds.length > 0 ? data['embeds'] = message.embeds : null
            message.attachments.size > 0 ? data['attachments'] = message.attachments.map(att => att.attachment) : null
            data['createdAt'] = message.createdAt

            let db = new this.database(data)
            db.save((err, res) => { if (err) console.log(err) })
        })
    }
}

module.exports.Tracker = Tracker
