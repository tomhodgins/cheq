#!/usr/bin/env node

// Import filesystem module
const fs = require('fs')

process.chdir(__dirname)

// Read counter from counter.txt
let counter = parseFloat(fs.readFileSync('./data/counter.txt')) || 0

const toBase36 = number => parseInt(number).toString(36)

const fromBase36 = number => parseInt(number, 36)

// Save: save current checklist
function save(data={}, file='./data/data.json') {
  fs.writeFileSync('./data/counter.txt', counter)
  return fs.writeFileSync(file, JSON.stringify(data))
}

// Load: load checlist from JSON
function load(file='./data/data.json') {
  const text = fs.readFileSync(file)
  return JSON.parse(
    text.length
    ? text
    : '{}'
  )
}

// Help: list built-in functions as options
function help() {
  return process.stdout.write(
    `\nAvailable functions are:\n\n${
      Object.entries(func)
        .map(entry => `- ${entry[0]}\n`)
        .join('')
    }\n`
  )
}

// Built-in keywords
const keywords = [
  'all',
  'tagged',
  'checked',
  'unchecked'
]

// Built-in functions
const func = {

  // List: display all checklist items
  list: function(term='all') {
    let data = load()
    let items = []
    if (arguments.length > 0) {
      if (keywords.includes(arguments[0])) {
        switch (arguments[0]) {
          case 'all':
            items = Object.entries(data)
          break
          case 'tagged':
            items = Object.entries(data)
              .filter(item => item[1].tags.includes(arguments[1]))
          break
          case 'checked':
            items = Object.entries(data)
              .filter(item => item[1].status)
          break
          case 'unchecked':
            items = Object.entries(data)
              .filter(item => !item[1].status)
          break
        }
      } else {
        items = Object.entries(data)
          .filter(item => item[1].tags.includes(term))
      }
    } else {
      items = Object.entries(data)
    }
    return items
      .map(task =>
        process.stdout.write(`${
          toBase36(task[0])
        } ${
          task[1].status
          ? '✔'
          : '✘'
        } ${
          task[1].title
        } ${
          task[1].tags.length
          ? 'tagged: ' + task[1].tags.join(', ')
          : ''
        }\n`)
      )
  },

  // Tag: add tag to checklist item
  tag: function(id, string) {
    let data = load()
    if (data[fromBase36(id)]) {
      if (data[fromBase36(id)].tags.includes(string)) {
        data[fromBase36(id)].tags.splice(data[fromBase36(id)].tags.indexOf(string), 1)
      } else {
        data[fromBase36(id)].tags.push(string)
      }
    }
    return save(data)
  },

  // Add: add new checklist item
  add: function(...title) {
    let data = load()
    data[counter] = {
      title: title.join(' '),
      tags: [],
      status: false
    }
    counter++
    return save(data)
  },

  // Remove: remove checklist item
  remove: function(term) {
    let data = load()
    let terms = term.split(' ')
    if (keywords.includes(terms[0])) {
      switch (terms[0]) {
        case 'all':
          data = {}
        break
        case 'tagged':
          for (let task in data) {
            if (task[1].tag.includes(terms[1])) {
              delete data[task]
            }
          }
        break
        case 'checked':
          for (let task in data) {
            if (data[task].status) {
              delete data[task]
            }
          }
        break
        case 'unchecked':
          for (let task in data) {
            if (!data[task].status) {
              delete data[task]
            }
          }
        break
      }
    } else if (data[fromBase36(term)]) {
      delete data[fromBase36(term)]
    }
    return save(data)
  },

  // Check: change status of checklist item to checked
  check: function(id) {
    const data = load()
    if (data[fromBase36(id)] && !data[fromBase36(id)].status) {
      data[fromBase36(id)].status = true
    }
    return save(data)
  },

  // Uncheck: change status of checklist item to unchecked
  uncheck: function(id) {
    const data = load()
    if (data[fromBase36(id)] && data[fromBase36(id)].status) {
      data[fromBase36(id)].status = false
    }
    return save(data)
  },

  // Rename: change title of existing checklist item by id
  rename: function(id, ...title) {
    const data = load()
    if (data[fromBase36(id)] && title) {
      data[fromBase36(id)].title = title.join(' ')
    }
    return save(data)
  }

}

// Run from command-line
if (process.argv[2]) {
  const cli = process.argv[2].split(' ')
  if (func[cli[0]]) {
    func[cli[0]](...cli.slice(1))
  } else {
    help()
  }
} else {
  help()
}