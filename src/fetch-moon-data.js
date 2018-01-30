const request = require('request-promise-native')

module.exports = () => {
  const date = new Date()
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  return request({
    uri: `http://api.usno.navy.mil/rstt/oneday?date=${dateStr}&loc=Kansas%20City,%20MO`,
    json: true
  })
}
