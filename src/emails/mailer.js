const handle = require('../lib/errorHandling')().handle;

module.exports = async (template, emailObjects) => {
    /*
    template -> name of email .pug template (name of the folder inside emails folder)
    emailObjects -> array of objects. Each object contains the data to be used in the given email. Must contain an object called 'recipient' and an array called 'attachments'. 'vars' is optional.
    emailObjects example: [
        { recipient: { email: 'john@example.com', name: 'john' }, vars: { randomVariable: "Hello world" }, attachments: [{ name: 'Image.png', path: "https://example.com/image.png" } },
        { recipient: { email: 'doe@example.com', name: 'doe' }, vars: { randomVariable: "Hello world", randomVariable2: "Bye" }, attachments: [{ name: 'Image2.png', path: "https://example.com/image2.png" }, { name: 'Image3.png', path: "https://example.com/image3.png" }] }
    ]
    Attachments (https://community.nodemailer.com/using-attachments/):
    Each element of the array 'attachments' MUST have a vars.attachments[n].name WITH extenstion (e.g. 'fileName.png'). It can be any name.
    If vars.attachments[n].path is present, it will be interpreted as a URL that points to the file.
    If vars.attachments[n].content is present, it will be interpreted as a multipart.
    */

    const keys = require('../keys')();
    const Email = require('email-templates');

    const fromMail = keys.configEmail.email;

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

    let message = {
        from: fromMail,
        attachments: []
    }

    await emailObjects.forEach(async (emailObject, i) => {
        // Set attachments
        message.attachments = []
        for (attachment of emailObject.attachments) {
            if (attachment && attachment.name) {
                if (attachment.path) {
                    message.attachments.push({
                        filename: attachment.name,
                        path: attachment.path
                    })
                } else if (attachment.content) {
                    message.attachments.push({
                        filename: attachment.name,
                        content: attachment.content
                    })
                }
            }
        }
        const email = new Email({
            views: { root: __dirname },
            message: message,
            transport: {
                service: 'gmail',
                auth: {
                    type: "OAuth2",
                    user: keys.configEmail.email,
                    clientId: keys.google.clientID,
                    clientSecret: keys.google.clientSecret,
                    refreshToken: keys.google.refreshToken
                }
            }

        })

        let [result, err] = await handle(email.send({
            template: template,
            message: {
                to: emailObject.recipient.email
            },
            locals: {
                name: emailObject.recipient.name,
                vars: emailObject.vars
            }
        }));

        if (err) console.log(err); return err;
    })
    return 0;
}