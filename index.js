const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const puppeteer = require("./puppeteer");
const axios = require("axios");

const PORT = 3000;
const token = 'Basic OEszS25lcFZzIyFWJVUyME1iTmtWTDR4SDpFdCRyOFJDZjB3R2xpS15BVVF5TFkmNVNhaXQxTHlEU1o5Vk9NZSQ3QVJ2alJHQl5sNDQ0Nkk3ZE5QblZ3eGxtSXpwNUZIOVpta3J6Tk1ESldkZSFlJElYYjglaEVlXmNHN1c=';

let runBot = false;

const getCookies = async url =>{
    while (runBot) {
        let cookies = await puppeteer.automate(url);

        if(cookies === null) continue;

        axios.post(
            'https://api.wearecoupons.com/api/Cookies/',
            {
                "cookie1": cookies,
                "storeId": 2
            },
            {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }).then(res =>{
                console.log(res);
        }).catch(error =>{console.log(error)});

    }
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: true }));

app.post('/start', async (req, res) =>{

    if(req.headers.authorization !== token) return res.status(401).send(`bad request`);

    if(runBot) return res.status(500).send(`Bot is already running on port ${PORT}`);

    runBot = true;

    getCookies(req.body.url);

    return res.send(`Bot is running on port ${PORT}`);
});

app.post('/stop', async (req, res) =>{

    if(req.headers.authorization !== token) return res.status(401).send(`bad request`);

    if(!runBot) return res.status(500).send('Bot is not running');

    runBot = false;

    return res.send('Bot stopped');
});

app.listen(PORT, () => {

    runBot = true;

    console.log(`App listening at http://localhost:${PORT}`);
});

