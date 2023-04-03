const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:true}));

// Declarando que deve ser carregado no site tudo o que estiver salvo localmente na pasta 'public'.
// OBS: No HTML os arquivos salvos localmente devem ser referenciados sem o "public/" no path.
// Ex: Apenas 'styles/signup.css' e não 'public/styles/signup.css'.
app.use(express.static("public"));

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post('/', function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us21.api.mailchimp.com/3.0/lists/7bbedd1df7';
    const options = {
        method: "POST",
        auth: "avocado:7ab75eba80f5a39ce7206913d5b19aeb-us21"
    };

    const request = https.request(url, options, function(response) {

        if (response.statusCode == 200) { // 200 - OK
            res.sendFile(__dirname + "/success.html");
        } else { // ERROR
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data))
        })
    });

    request.write(jsonData);
    request.end();
})

// Redirencionando para a página signup.html caso o usuário clique em "Try Again"
app.post('/failure', function(req, res) {
    res.redirect('/');
})

app.listen(port, function() {
    console.log("Servidor rodando na porta 3000");
})

// API Key - 7ab75eba80f5a39ce7206913d5b19aeb-us21

// List ID - 7bbedd1df7