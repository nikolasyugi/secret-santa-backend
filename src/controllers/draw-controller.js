const Draw = require('../models/Draw');
const Participant = require('../models/Participant');
const shuffle = require('../lib/shuffle');
const mailer = require('../emails/mailer');
const handle = require('../lib/errorHandling')().handle;

module.exports = {
    async access(req, res, next) {
        const [participant, error] = await handle(Participant.findOne({ code: req.body.code }).orFail());

        if (error) return next(error);
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

            //Email
            shuffled[i].recipient = { email: shuffled[i].email, name: shuffled[i].name }
            shuffled[i].attachments = []
            shuffled[i].vars = {}
            shuffled[i].vars.drawName = name
            shuffled[i].vars.code = shuffled[i].code
            shuffled[i].vars.name = shuffled[i].name

        }
        const [, ptErr] = await handle(Participant.insertMany(shuffled));
        if (ptErr) return next(ptErr);

        mailer('seeFriend', shuffled);

        res.json({})
    }
}