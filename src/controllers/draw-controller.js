const Draw = require('../models/Draw');
const Participant = require('../models/Participant');
const shuffle = require('../lib/shuffle');
const mailer = require('../lib/emails/mailer');
const handle = require('../lib/errorHandling')().handle;

module.exports = {
    async access(req, res, next) {
        const [participant, error] = await handle(Participant.findOne({ code: req.body.code }).orFail());

        if (error) next(error);
        else res.json(participant);
    },

    async draw(req, res, next) {
        const { name, participants } = req.body;
        const shuffled = shuffle(participants);

        const [draw, drawErr] = await handle(Draw.create({ name: name }));
        if (drawErr) return next(drawErr);

        for (let i = shuffled.length - 1; i >= 0; i--) {
            shuffled[i].draw = draw._id;
            shuffled[i].code = Math.random().toString(16).substring(2);
            if (i != shuffled.length - 1) {
                shuffled[i].friend = shuffled[i + 1].name;
            } else {
                shuffled[i].friend = shuffled[0].name;
            }
        }
        const [, ptErr] = await handle(Participant.insertMany(shuffled));
        if (ptErr) return next(ptErr);

        mailer(shuffled, name);

        res.json({})
    }
}