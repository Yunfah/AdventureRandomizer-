 // Base64 encoded client id and secret
const AUTH = 'ODhmZTVjZTRjMjQwNDkwNDk4ZmMzNDRkNDZjODllZDI6YzVkNDUyMjc0YzgzNDNjNDg0MGU0MzE4ZTZmNzU3MjA=';
const ACCESS_TOKEN_URL = 'https://accounts.spotify.com/api/token';

const request = require('request');
const connect = require('connect');
const serveStatic = require('serve-static');

let accessToken = '';

const app = connect();
app.use(function(req, res, next){
    if (req.url === '/accessToken') {
        request(
            {
                url: ACCESS_TOKEN_URL,
                method: 'POST',
                form: { grant_type: 'client_credentials' },
                headers: {
                    'Authorization': 'Basic ' + AUTH,
                    'Content-Type':  'application/x-www-form-urlencoded'
                },
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    accessToken = JSON.parse(body).access_token;
                    res.end(accessToken);
                }
            }
        );
    } else {
        next();
    }
});

app.use(serveStatic(__dirname));

app.listen(8080, function(){
    console.log('Server running on 8080...');
});


