const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')

const { handler } = require('./js_scrape');

app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('frontend'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/webpage.html'));
})

app.post('/data', handler)

// 404
app.use((req, res, next) => {
    res.status(404).send('not found');
})
// error handling
app.use((err, req, res, next) => {
    res.status(500).send(err.message || err.toString() ||'server error');
})

app.listen(8080, () => {
    console.log('app start at http://127.0.0.1:8080');
})
