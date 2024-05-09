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
  ;(function () {
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')

    Math.uuid = function (len, radix) {
      var chars = CHARS,
        uuid = [],
        i
      radix = radix || chars.length

      if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
      } else {
        var r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | (Math.random() * 16)
            uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
          }
        }
      }
      return uuid.join('')
    }

    Math.uuidFast = function () {
      var chars = CHARS,
        uuid = new Array(36),
        rnd = 0,
        r
      for (var i = 0; i < 36; i++) {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
          uuid[i] = '-'
        } else if (i == 14) {
          uuid[i] = '4'
        } else {
          if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0
          r = rnd & 0xf
          rnd = rnd >> 4
          uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
        }
      }
      return uuid.join('')
    }

    Math.uuidCompact = function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    }
  })()

  let data = { bookshelves: [], announcements: [], publications: [] }
  var users = ['User A', 'User B', 'User C', 'User D', 'User E', 'User F', 'User G', 'User H', 'User I', 'User J']
  var filetypes = ['.pdf', '.doc', '.docx', '.txt', '.rtf']
  var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  var cats = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E', 'Category F', 'Category G', 'Category H']
  var areas = ['Mission Area A', 'Mission Area B', 'Mission Area C', 'Mission Area D', 'Mission Area E', 'Mission Area F', 'Mission Area G', 'Mission Area H']
  var prefixes = ['Prefix A', 'Prefix B', 'Prefix C', 'Prefix D', 'Prefix E', 'Prefix F', 'Prefix G', 'Prefix H']

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
      Id: i,
      Title: 'DOCUMENT ' + i,
      Modified: moment().format('MM/DD/YYYY'),
      Author: users[getRandomInt(10)],
      Body: lorem.generateSentences(4),
      ModifiedBy: {
        Title: users[getRandomInt(10)],
        Id: 1,
        Email: ''
      }
    })
  }

  for (let i = 0; i < 1500; i++) {
    let ext = filetypes[getRandomInt(5)]
    let title = 'Publication-' + letters[getRandomInt(8)] + '-' + i + '-' + letters[getRandomInt(8)]
    let name = title + ext
    let location = 'Folder-' + letters[getRandomInt(8)] + '/' + name
    data.publications.push({
      id: i,
      docid: Math.uuid(),
      title: title,
      name: name,
      location: location,
      filetype: ext,
      category: cats[getRandomInt(8)],
      area: areas[getRandomInt(8)],
      prefix: prefixes[getRandomInt(8)]
    })
  }
  return data
}
