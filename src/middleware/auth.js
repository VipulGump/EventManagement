const jwt = require('jsonwebtoken');
const {User} = require('../models/user');


// Authentication for the token
const auth = async (req,res,next)=>{
    try{
        const token = req.header(`Authorization`).replace('Bearer ','');
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findAll({ where:{id: decoded.id, authToken: token}});
        console.log(user);
       if(user.length==0){
        throw new Error();
       }

       req.token = token;
       req.user = user[0]; // This is done so route handler dont need to waste resources finding the user again.
       next()
    } catch(e){
        console.log(e);
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth;