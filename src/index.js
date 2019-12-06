const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').Server(app);
const mongo_uri = require('./keys')().dbUrl;

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(bodyParser.json());
app.use(cors())
app.use(require('./routes'))

server.listen(process.env.PORT || 3333, function () {
    console.log(`Server listening on port ${process.env.PORT || 3333}`)
});

