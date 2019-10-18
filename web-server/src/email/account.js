const sgMail = require('@sendgrid/mail');

const sendGridApiKey = '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';

const handlbars = require('handlebars');
const templates = require('../../templates/emails/user');

const rootUrl = 'http://localhost:3002';
const activatePath = '/api/user/activate';
const supportEmail = 'violin_helper@luapp.com';

const generateActivateLink = (token) => {
  return `${rootUrl}${activatePath}?token=${token}`;
}

sgMail.setApiKey(sendGridApiKey);

const sendWelcomeEmail = (dest, username, activateToken) => {
  const welcomeTemplate = handlbars.compile(templates.welcome);
  const html = welcomeTemplate({
    username,
    url: generateActivateLink(activateToken),
    supportEmail
  });
  sgMail.send({
    from: supportEmail,
    to: dest,
    subject: 'Welcome to violin helper!',
    html
  });
}

module.exports = {sendWelcomeEmail};