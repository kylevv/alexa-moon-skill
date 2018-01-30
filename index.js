'use strict'
const Alexa = require('alexa-sdk')
const fetchMoonData = require('./src/fetch-moon-data')

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
        this.response.speak(`The current moon phase is a ${data.curphase} at ${data.fracillum} full`)
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
