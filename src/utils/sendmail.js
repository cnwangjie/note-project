import nconf from 'nconf'
import mailgun from 'mailgun-js'

const apiKey = nconf.get('mailgun:api_key')
const domain = nconf.get('mailgun:domain')
const from = nconf.get('mailgun:from')

const sendmail = ({subject, text, to, attachment}) => {
  const sender = mailgun({apiKey, domain})
  return new Promise((resolve, reject) => {
    const data = {from, to, subject, text}
    if (attachment) data.attachment = attachment
    sender.messages().send(data, (err, body) => {
      if (err) reject(err)
      else resolve(body)
    })
  })
}

export default sendmail
