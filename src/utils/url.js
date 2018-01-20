import nconf from 'nconf'
import path from 'path'

const url = (route, qs) => {
  let uri = encodeURI(route)
  if (qs) uri+ '?' + Object.keys(qs).map(i => i + '=' + encodeURIComponent(qs[i])).join('&')
  return path.join(nconf.get('url'), uri)
}

export default url
