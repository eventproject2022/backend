const nodemailer = require('nodemailer');
const ejs = require('ejs');
const mailer = require('../_configs/mailer.config');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const path = require('../_constants/path.constant');
const auth = {
    user: mailer.user,
    refreshToken: mailer.refreshToken,
    expires: mailer.expries,
    accessToken: ''
}
var googleOauth2Client = new OAuth2(mailer.clientId, mailer.clientSecret, mailer.redirectUri);
googleOauth2Client.setCredentials({
    refresh_token: mailer.refreshToken
});
googleOauth2Client.refreshAccessToken(function (err, tokens) {
    if (err) {
        console.log(err);
    } else {
        auth.accessToken = { access_token: tokens.access_token };
        googleOauth2Client.credentials = { access_token: tokens.access_token };
    }
});
const transporter = nodemailer.createTransport({
    service: mailer.service,
    auth: {
        type: mailer.type,
        clientId: mailer.clientId,
        clientSecret: mailer.clientSecret,
    },
});

exports.sendMail = (receiver, type, password, email) => {
    return new Promise((resolve, reject) => {
        if (type === 'forgot_password') {
            transporter.sendMail({
                from: mailer.user,
                to: receiver,
                subject: "Reset password",
                html: "OTP is: " + OTP,
                auth: auth,
            }).then((send) => {
                resolve(send);
            }).catch((err) => {
                reject(err);
            });
        } else if (type === 'create_admin') {
            transporter.sendMail({
                from: mailer.user,
                to: receiver,
                subject: "Admin credentials",
                html:
                    "website: " + "<a href='" + path.adminPage + "'>'" + path.adminPage + "'</a>" + "<br> <br>" +
                    "email # " + receiver + '<br> <br>' + "password : " + password,
                auth: auth,
            }).then((send) => {
                resolve(send);
            }).catch((err) => {
                reject(err);
            });
        } else if (type === 'create_company') {
            transporter.sendMail({
                from: mailer.user,
                to: receiver,
                subject: "Company credentials",
                html:
                    "website: " + "<a href='" + path.adminPage + "'>'" + path.adminPage + "'</a>" + "<br> <br>" +
                    "email # " + receiver + '<br> <br>' + "password : " + password,
                auth: auth,
            }).then((send) => {
                resolve(send);
            }).catch((err) => {
                reject(err);
            });
        }
    });
}