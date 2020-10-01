const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let config = require('./config.js');
let middleware = require('./middleware.js');
let app = require('./micro.js');

//TOKEN GENERATION
class HandlerGenerator {
    login(req, res) {
        let username = req.body.username; 
        let password = req.body.password;
        // to fetch from db
        let mockedUsername = 'admin';
        let mockedPassword = 'password';

        if (username && password) {
            if (username === mockedUsername && password === mockedPassword ) {
                let token = jwt.sign({username: username},
                    config.secret,
                    {
                    expiresIn: '24h'
                    }
                );
                //return jwt token for future API calls
                res.json({
                    success:true,
                    message:'Authentication successful',
                    token: token
                });
            } else {
                res.json({
                    success:false,
                    message:'Incorrect username or password! please try again'
                });
            }
        } else {
            res.json({
                success:false,
                message:'Authentication failed! please check the request...'
            });
        } 
    }
    testFunction (req, res) {
        res.json({
            success: true,
            message:'Testing successful.. '
        });
    }
}

//starting point of server
function main () {
    let app = express();
    let handlers = new HandlerGenerator();
    const port = 100;
    app.use(bodyParser.urlencoded({ //middleware
        extended:true
    }));
    app.use(bodyParser.json());
    //Routes & handlers
    app.post('/login',handlers.login);
    app.get('/', middleware.checkToken, handlers.testFunction);

    app.listen(port, () => console.log(`server is listening on port:${port}`))
}
main();