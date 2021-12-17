const Users = require('../users/users-model')

function validateRegistrationBody(req, res, next){
    if(!req.body.username || !req.body.username.trim() || !req.body.password || !req.body.password.trim()){
        return next({status: 400, message: 'username and password required'})
    }

    next()
}

async function checkUsernameAvailable(req, res, next){
    try{
        const user = await Users.findBy({username: req.body.username})
        !user ? next() : res.status(400).json({message: 'username taken'})
    }catch(err){
        next(err)
    }  
    
}

module.exports = { validateRegistrationBody, checkUsernameAvailable }
