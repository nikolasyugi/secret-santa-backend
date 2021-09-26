const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const keys = require('./keys')();
const errorHandling = require('./lib/errorHandling')();

const app = express();
const server = require('http').Server(app);

/* MONGO */
const mongo_uri = keys.dbUrl;
mongoose.connect(mongo_uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
/* MONGO */

/* GENERAL MODULES */
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
/* GENERAL MODULES */

/*CORS*/
const corsSettings = require('./cors');
app.use(cors(corsSettings));
/*CORS*/

/* ROUTES */
app.use(require('./routes'))
app.use('/*', (req, res, next) => {
    errorHandling.routeNotFound(next);
});
/* ROUTES */

/* ERROR HANDLING */
app.use((err, req, res, next) => {
    errorHandling.throwError(err, res)
})
/* ERROR HANDLING */


server.listen(process.env.PORT || 8080, function () {
    console.log(`Server listening on port ${process.env.PORT || 8080}`)
});