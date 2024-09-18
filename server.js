const express = require('express');
const request = require('request');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from 'public' directory

app.get('/silk', (req, res) => {
    const colorCode = req.query.colorCode;
    const url = `https://racing.racingnsw.com.au/InteractiveForm/JockeySilkDetails.aspx?ColorID=${colorCode}`;
    
    request(url, (error, response, body) => {
        if (error) {
            return res.status(500).send('Error fetching silk details');
        }
        res.send(body);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
