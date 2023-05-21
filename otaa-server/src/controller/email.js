const nodemailer = require("nodemailer");

exports.sendMail = async (option) => {
    //1. create transport
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        }
    })
    //2. define the email option
    const mailOption = {
        from: 'sudippal551@gmail.com',
        to: option.email,
        subject: option.subject,
        text: option.message,
    }
    //3. send the mail
    await transporter.sendMail(mailOption);
}





// testing purpose
exports.mail = async (req, res) => {

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "0f2ecdacf9b64e",
            pass: "da4f8d809210e5"
        }
    });

    const mailOptions = {
        from: 'sudippal93821@gmail.com',
        to: 'sudippal551@gmail.com',
        subject: 'Subject',
        text: 'Email content'
    };

    try {

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                // do something useful
            }
        });
        return res.status(200).send("success")
    } catch (err) {
        return res.status(500).send("error")
    }
}