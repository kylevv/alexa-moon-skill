'use strict'
const Alexa = require('alexa-sdk')
const fetchMoonData = require('./src/fetch-moon-data')
const phases = {
  'New Moon': '100%',
  'First Quarter': '50%',
  'Full Moon': '100%',
  'Last Quarter': '50%'
}

exports.handler = function (event, context, callback) {
  const alexa = Alexa.handler(event, context)
  alexa.registerHandlers(handlers)
  alexa.execute()
}

const handlers = {
  'LaunchRequest': function () {
    this.emit('DescribeMoon')
  },
  'MoonPhaseIntent': function () {
    this.emit('DescribeMoon')
  },
  'DescribeMoon': function () {
    fetchMoonData()
      .then((data) => {
        if (!data || data.error) return Promise.reject(new Error('API returned an error'))
        const phase = data.curphase || data.closestphase.phase
        const fracillum = data.fracillum || phases[data.closestphase.phase]
        this.response.speak(`The current moon phase is a ${phase} at ${fracillum} full`)
      })
      .catch(() => {
        this.response.speak('Sorry, I couldn\'t retrieve the information')
      })
      .then(() => {
        this.emit(':responseReady')
      })
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = 'This is the moon phase skill'
    const reprompt = 'Ask for the current moon phase'
    this.response.speak(speechOutput).listen(reprompt)
    this.emit(':responseReady')
  },
  'AMAZON.CancelIntent': function () {
    this.response.speak('Goodbye!')
    this.emit(':responseReady')
  },
  'AMAZON.StopIntent': function () {
    this.response.speak('See you later!')
    this.emit(':responseReady')
  }
}
