module.exports = async (participants, drawName) => {
    const nodemailer = require('nodemailer');
    const keys = require('../keys')();

    const fromMail = keys.configEmail.email;
    const webUrl = keys.webUrl;
    const subject = `Sorteio do amigo secreto ${drawName}`;

    const { google } = require('googleapis');
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
        keys.google.clientID,
        keys.google.clientSecret,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
        refresh_token: keys.google.refreshToken
    });
    const accessToken = oauth2Client.refreshAccessToken()
        .then(res => res.credentials.access_token);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: keys.configEmail.email,
            clientId: keys.google.clientID,
            clientSecret: keys.google.clientSecret,
            refreshToken: keys.google.refreshToken,
            accessToken: accessToken
        }
    });


    console.log(keys.webUrl)
    for (let i = participants.length - 1; i >= 0; i--) {
        let html = `<h1>Olá ${participants[i].name}</h1><a href="${webUrl}friend?code=${participants[i].code}">Clique aqui para ver seu amigo secreto</a>`;
        let info = await transporter.sendMail({
            from: fromMail,
            to: participants[i].email,
            subject: subject,
            html: html
        })
    }

    return 0;
}