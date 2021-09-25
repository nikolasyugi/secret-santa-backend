let whitelist = ['https://amigo-secreto-web.herokuapp.com/', 'https://amigo-secreto-web.herokuapp.com']

if (process.env.NODE_ENV !== "production") whitelist.push('http://localhost:3000', 'http://localhost')
module.exports = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || origin == undefined) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};