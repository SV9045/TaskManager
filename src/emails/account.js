const sgMail = require('@sendgrid/mail');
const sendGridAPIKey = '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';

sgMail.setApiKey(sendGridAPIKey);

const sendWelcomeEmail= (email, name) => {
  sgMail.send({
    to: email,
    from: 'sunnyshh45@gmail.com',
    subject: 'TaskManager App',
    text: `Welcome to the app, ${name}. We are wishing you a more enjoyable life.`
  }).then(() => {
    console.log('Status: SUCCESS')
  }).catch((e) => {
    console.log('Status: ERROR', e)
  })
}

const sendCancelEmail= (email, name) => {
  sgMail.send({
    to: email,
    from: 'sunnyshh45@gmail.com',
    subject: 'TaskManager App',
    text: `Sorry to see you go ${name}. We are wishing you a more enjoyable life.`
  }).then(() => {
    console.log('Status: SUCCESS')
  }).catch((e) => {
    console.log('Status: ERROR', e)
  })
}


module.export = {
  sendWelcomeEmail,
  sendCancelEmail
}