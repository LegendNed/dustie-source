const mongoose = require('mongoose')
const defaultConfig = require('./models/default')

class Database {
    constructor (connection) {
        if (typeof (connection) !== 'string') throw new Error('Invalid MongoDB URL was provided!')
        this.initDB(connection)
    }
    initDB(connection) {
        mongoose.connect(connection, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('connected', () => console.log('Database Online'));
        mongoose.connection.on('err', (err) => console.error)

        this.database = mongoose.model('Guiilds', require('./models/schema'))
    }
    async create(id) {
        if (!id || typeof (id) !== 'string') throw new Error('Invalid ID was provided!')
        else {
            if (await this.get(id)) return // Guild already exists
            let guild = new this.database(defaultConfig)
            guild.guildID = id
            return await new Promise(resolve => {
                guild.save((err, res) => {
                    if (err) throw err
                    else resolve(res)
                })
            })
        }
    }

    async delete(id) {
        if (!id || typeof (id) !== 'string') throw new Error('Invalid ID was provided!')
        return await new Promise(resolve => {
            this.database.findOneAndDelete({ guildID: id }, (err, res) => {
                if (err) throw err
                else resolve(res)
            })
        })
    }

    async get(id, path) {
        if (!id || typeof (id) !== 'string') throw new Error('Invalid ID was provided!')
        else if (path && typeof (path) !== 'string') throw new Error('Path provided is not a string!')
        else {
            let data = await new Promise(resolve => {
                this.database.findOne({ guildID: id }, (err, object) => {
                    if (err) throw err
                    else resolve(object)
                })
            })
            if (!data) await this.create(id)
            else return data ? (path ? traverse(data, path) : data) : (path ? traverse(defaultConfig, path) : defaultConfig)
        }
    }

    async set(id, path, value) {
        if (!id || typeof (id) !== 'string') throw new Error('Invalid ID was provided!')
        else if (path && typeof (path) !== 'string') throw new Error('Path provided is not a string!')
        else {
            let update = new Object()
            update[path] = value
            return await new Promise(resolve => {
                this.database.updateOne({ guildID: id }, { $set: update }, (err, res) => {
                    if (err) throw err
                    else resolve(res)
                })
            })
        }
    }
}

const traverse = (obj, keys) => {
    return keys.split('.').reduce(function (cur, key) {
        return cur[key];
    }, obj);
};

module.exports.Database = Database