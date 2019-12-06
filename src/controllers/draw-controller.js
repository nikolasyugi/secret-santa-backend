const Draw = require('../models/Draw');
const Participant = require('../models/Participant');
const shuffle = require('../lib/shuffle');
const mailer = require('../lib/mailer');

module.exports = {
    async access(req, res) {
        const participant = await Participant.find({ code: req.body.code });
        res.json(participant);
    },

    async draw(req, res) {
        const { name, participants } = req.body;
        const shuffled = shuffle(participants);

        const draw = await Draw.create({ name: name });

        for (let i = shuffled.length - 1; i >= 0; i--) {
            shuffled[i].draw = draw._id;
            shuffled[i].code = Math.random().toString(16).substring(2);
            if (i != shuffled.length - 1) {
                shuffled[i].friend = shuffled[i + 1].name;
            } else {
                shuffled[i].friend = shuffled[0].name;
            }
        }
        await Participant.insertMany(shuffled);

        mailer(shuffled, name);

        res.json({})
    }
}