const jwt = require('jsonwebtoken');
const { nextTick } = require('process');
require('dotenv').config();

const  verifyJWT =(req,res,next)=>{
    const authHeather = req.headers['authorization']
    if(!authHeather) return res.status(401).send("no se pudo")
    console.log(authHeather)
    const tkn = authHeather.split(' ')[1];
    jwt.verify(tkn,
        process.env.ACCES_TKN_KEY,
        (err,decoded)=>{
            if(err) return res.status(403).send("expiro")
            req.matricula = decoded.matricula
        })
    next()


}
module.exports=verifyJWT