const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').Server(app);

// mongoose.connect('mongodb+srv://nikolasyugi_debug:nikolasyugi@cluster0-fheyw.mongodb.net/test?retryWrites=true&w=majority', {
//     useNewUrlParser: true
// })

mongoose.connect('mongodb://localhost/secret-santa', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(bodyParser.json());
app.use(cors())
app.use(require('./routes'))

server.listen(3333, function () {
    console.log(`Server listening on port ${3333}`)
});

