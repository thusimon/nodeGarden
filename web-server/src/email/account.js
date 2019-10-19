const sgMail = require('@sendgrid/mail');

const handlbars = require('handlebars');
const templates = require('../../templates/emails/user');

const rootUrl = 'http://localhost:3002';
const activatePath = '/api/user/activate';
const supportEmail = 'violin_helper@luapp.com';

const generateActivateLink = (token) => {
  return `${rootUrl}${activatePath}?token=${token}`;
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

const sendGoodbyeEmail = (dest, username) => {
  const goodbyeTemplate = handlbars.compile(templates.goodbye);
  const html = goodbyeTemplate({
    username
  });
  sgMail.send({
    from: supportEmail,
    to: dest,
    subject: 'We will miss you',
    html
  })
}

module.exports = {sendWelcomeEmail, sendGoodbyeEmail};