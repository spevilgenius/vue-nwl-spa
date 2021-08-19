/* eslint-disable @typescript-eslint/no-var-requires */
var moment = require('moment')
var LoremIpsum = require('lorem-ipsum').LoremIpsum

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
})

module.exports = () => {
  let data = { bookshelves: [], announcements: [] }
  var users = ['User A', 'User B', 'User C', 'User D', 'User E', 'User F', 'User G', 'User H', 'User I', 'User J']
  /* var orgs = ['MA', 'MB', 'MC', 'QA', 'QB', 'QC']
  var years = ['2014', '2015', '2016', '2017', '2018', '2019']
  var causecats = ['Cat A', 'Cat B', 'Cat C', 'Cat D', 'Cat E', 'Cat F', 'Cat G']
  var causes = ['Cause 1', 'Cause 2', 'Cause 3', 'Cause 4', 'Cause 5', 'Cause 6', 'Cause 7'] */

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  let shelfcount = getRandomInt(21)
  if (shelfcount < 10) {
    shelfcount = 10
  }
  console.log(shelfcount)

  let announcementcount = getRandomInt(10)
  if (announcementcount < 5) {
    announcementcount = 5
  }
  console.log(announcementcount)

  for (let i = 0; i < shelfcount; i++) {
    data.bookshelves.push({
      id: i,
      text: 'SHELF ' + i,
      value: 'SHELF ' + i
    })
  }
  console.log(data.bookshelves.length)

  for (let i = 0; i < announcementcount; i++) {
    data.announcements.push({
      id: i,
      title: 'DOCUMENT ' + i,
      date: moment().format('MM/DD/YYYY'),
      author: users[getRandomInt(10)],
      description: lorem.generateSentences(4)
    })
  }
  return data
}
