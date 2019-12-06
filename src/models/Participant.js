const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String, required: true, validate: {
            validator: function (email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            message: props => `${props.value} is not a valid e-mail`
        },
    },
    code: String,
    friend: String,
    draw: { type: mongoose.Schema.Types.ObjectId, ref: 'Draw' }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Participant', ParticipantSchema);