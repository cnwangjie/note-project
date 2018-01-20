import nconf from 'nconf'
import mailgun from 'mailgun-js'
import MailComposer from 'nodemailer/lib/mail-composer'

const apiKey = nconf.get('mailgun:api_key')
const domain = nconf.get('mailgun:domain')
const from = nconf.get('mailgun:from')

const sendmail = ({subject, html, to, attachments}) => {
  return new Promise((resolve, reject) => {
    const sender = mailgun({apiKey, domain})
    const mailOptions = {from, to, subject, html}
    if (attachment) data.attachment = attachment
    const mail = new MailComposer(mailOptions)
    mail.compile().build((err, msg) => {
      if (err) reject(err)
      else {
        const data = {to, message: msg.toString('ascii')}
        sender.messages().sendMime(data, (err, body) => {
          if (err) reject(err)
          else resolve(body)
        })
      }
    })
  })
}

export default sendmail
