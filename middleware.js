let jwt = require('jsonwebtoken');
const config = require('./config.js')


//TOKEN VERIFICATION

let checkToken = (req, res, next) => { 
    let token = req.headers['authorization'];
    if (token.startsWith('Bearer ')) {
        //Remove Bearer from string
        token =  token.slice(7, token.length);
    } 
    if (token) {
        jwt.verify(token, config.secret, (err,decoded) => {
            if (err) {
                return res.json({
                    success :false,
                    message : 'INVALID TOKEN'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.json({
            success:false,
            message:'AUTH TOKEN NOT SUPPLIED'
        });
    }
};

module.exports = {
    checkToken: checkToken
}