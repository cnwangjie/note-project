import ejs from 'ejs'
import path from 'path'

const renderFile = (template, data) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(path.join(__dirname, './../../resources/template', template) + '.ejs', data, (err, html) => {
      if (err) reject(err)
      else resolve(html)
    })
  })
}

export default renderFile
