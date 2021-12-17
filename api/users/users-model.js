const db = require('../../data/dbConfig')

module.exports = {
    add,
    findBy
}

async function add(user){
    const [id] = await db('users').insert(user)
    return db('users').where('id', id)
}

function findBy(filter){
    return db("users")
    .where(filter)
    .first()
}
