module.exports = async (participants, drawName) => {
    const keys = require('../../keys')();
    const Email = require('email-templates');

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

    const email = new Email({
        views: { root: __dirname },
        message: {
            from: fromMail
        },
        transport: {
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: keys.configEmail.email,
                clientId: keys.google.clientID,
                clientSecret: keys.google.clientSecret,
                refreshToken: keys.google.refreshToken,
                accessToken: accessToken
            }
        }

    })

    for (let i = participants.length - 1; i >= 0; i--) {
        email.send({
            template: 'seeFriend',
            message: {
                to: participants[i].email
            },
            locals: {
                name: participants[i].name,
                webUrl: webUrl,
                subject: subject,
                drawName: drawName,
                code: participants[i].code
            }
        });
    }

    return 0;
}