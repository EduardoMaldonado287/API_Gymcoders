const privatekey = '2633e3b648dcad79a0591411f061a858e0a4063500f3e09a264e9f3323fdd9c2e610430216aa4176b3b5371c59e92116f9bbaa2dcc6670d5dc262cf9f54796ec'
const publicKey = 'd971cd7b612e665d81aa73116ee07983a3d2cc5558ef7824157258e73c35e2c0ef1f7789acf109b233d9fe23b02344ea38ff99c2b31c27fbedb1fd582b3efed7'

const jwt = require('jsonwebtoken');


function signJWT(payload,expiresIn){
    return jwt.sign(payload,privatekey,expiresIn);
}
function verifyJWT(token){
    try{
        const decoded = jwt.verify(token,publicKey);
        return token
    }catch(error){
        return error
    }
}
module.exports= {verifyJWT,signJWT}