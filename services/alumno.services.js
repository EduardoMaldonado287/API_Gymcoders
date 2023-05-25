const privatekey = `
VaCP8FxYJ2ZfxcyPN67tyQY0y_pNehd3xK1VvawUFvwEdmrpWfyQ1Uv5MqXkXnOLKryksIrE5tQinJXmb4HbQVGoFwuO2S46I1oPJBRc7ZmxtwhixKM5e0ssSdq8GIH3RQNlZtrWMAfbBvWwLXf-TflKYj8CYjm7xDswFUxh1Cp68-t8ySe-w-q13JeGUPyu50aK9h8wE5ChGMDyOvsYaOKNWjvQ-MxD3qywDLDna0tddr5w2X6ve4gjEz4CEbtxNcDP55QrbrevYCk0AgUcuTiHo5Ok2KjFcrijrf3sd77ZsPwuBvD6ZlpDa9NMwx6eYDt3FmXbws3ppNuaBWWK
`
const publicKey = `
43CmWwO9VBQMhdnRohaDl5Y421N_lACCaysAq5vv4a3oxf4-9jGlTn-N7AlqiwZiyxz1dvFOHk64D7I7J3y87ZHJoyZS_Q-2u9fU3SeIedmKQbQdjMUtaZBWYrJyWAkV8ljeyyJuryPJ-TYdJwf2BCnj9x3gDhsnVCEcrgPi3sIi3bxHeATAG62g-Lj04V1m0UVgsgNOiSgNAaUKnvRoZvcZ__WMlIjpDWobLsx1aEYm9LnAhTP39CuR0I-RM1xdEFY5WyyakB1SRuGBx9kkP4gtMr6nqZMmaa8wULS16LMKHXpVFES8ifRoB4yVcHg40gS-KsvX9lY8-Ge4sQCz
`

const jwt = require('jsonwebtoken');

function signJWT(payload,expiresIn){
    return jwt.sign(payload,privatekey,expiresIn);
}
function verifyJWT(token){
    try{
        const decoded = jwt.verify(token,publicKey);
    }catch(error){
        return error
    }
}
module.exports(verifyJWT,signJWT)