const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandling = require('./lib/errorHandling')();

const app = express();
const server = require('http').Server(app);
const mongo_uri = require('./keys')().dbUrl;

mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors())
app.use(require('./routes'))

app.use((req, res, next) => {
    errorHandling.routeNotFound(next);
});

app.use((err, req, res, next) => {
    errorHandling.throwError(err, res)
})

server.listen(process.env.PORT || 3333, function () {
    console.log(`Server listening on port ${process.env.PORT || 3333}`)
});

