const db = require('../../data/dbConfig')

module.exports = {
    add,
}

async function add(user){
    const [id] = await db('users').insert(user)
    return db('users').where('id', id)
}
