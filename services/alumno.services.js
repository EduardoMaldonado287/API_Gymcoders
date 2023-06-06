
const jwt = require('jsonwebtoken');
require('dotenv').config();


function signJWT(payload,expiresIn){
    return jwt.sign(payload,process.env.ACCES_TKN_KEY,expiresIn);
}
function refresh(payload,expiresIn){
    return jwt.sign(payload,process.env.REFRESH_TKN_KEY,expiresIn);
}
module.exports= {refresh,signJWT}