const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "raphaelgodsplan@gmail.com",
        subject: "Welcome to the app",
        text: `Hello ${name}, welcome to the app`
    }).then(() => {
        console.log('email')
    }).catch((error) => {
        console.log(error)
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "raphaelgodsplan@gmail.com",
        subject: "Account cancellation",
        text: `Hello ${name}, we are sad you want to go. Is there anything we would have done better?`
    }).then(() => {
        console.log('email')
    }).catch((error) => {
        console.log(error)
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}