#!/usr/bin/env node

// Import filesystem module
const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const cachedir = require('cachedir')
const cache = cachedir('cheq')

// Create cached files if they don't exist yet
mkdirp.sync(cache)
fs.writeFileSync(path.resolve(cache, 'counter.txt'), '', {flag: 'a'})
fs.writeFileSync(path.resolve(cache, 'data.json'), '', {flag: 'a'})

// Read counter from counter.txt
let counter = parseFloat(fs.readFileSync(path.resolve(cache, 'counter.txt'))) || 0

// Convert number to base36
const toBase36 = number => parseInt(number).toString(36)

// Convert number from base36
const fromBase36 = number => parseInt(number, 36)

// Save: save current checklist
function save(data={}, file=path.resolve(cache, 'data.json')) {

  fs.writeFileSync(path.resolve(cache, 'counter.txt'), counter)

  return fs.writeFileSync(file, JSON.stringify(data))

}

// Load: load checlist from JSON
function load(file=path.resolve(cache, 'data.json')) {

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
  list: function(...terms) {

    const data = load()
    let items = []

    if (terms.length > 0) {

      if (keywords.includes(terms[0])) {

        switch (terms[0]) {

          case 'tagged':
            items = Object.entries(data)
              .filter(item =>
                terms.slice(1).every(term =>
                  item[1].tags.includes(term)
                )
              )
          break

          case 'checked':
            items = Object.entries(data)
              .filter(item => item[1].status)
          break

          case 'unchecked':
            items = Object.entries(data)
              .filter(item => !item[1].status)
          break

          case 'all':
          default:
            items = Object.entries(data)
          break

        }

      } else {

        items = Object.entries(data)
          .filter(item =>
            terms.every(term =>
              item[1].tags.includes(term)
            )
          )

      }

    } else {

      items = Object.entries(data)

    }

    return items.map(task =>
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

  // Add: add new checklist item
  add: function(...title) {

    const data = load()

    data[counter] = {
      title: title.join(' '),
      tags: [],
      status: false
    }
    counter++

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

  // Tag: add tag to checklist item
  tag: function(id, ...tags) {

    const data = load()

    if (data[fromBase36(id)]) {

      tags.forEach(string =>
        data[fromBase36(id)].tags.includes(string)
        ? data[fromBase36(id)].tags
            .splice(data[fromBase36(id)].tags.indexOf(string), 1)
        : data[fromBase36(id)].tags.push(string)
      )

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

  },

  // Remove: remove checklist item
  remove: function(...terms) {

    let data = load()

    if (keywords.includes(terms[0])) {

      switch (terms[0]) {

        case 'all':
          data = {}
        break

        case 'tagged':
          for (let task in data) {
            if (
              terms.slice(1).every(term =>
                data[task].tags.includes(term)
              )
            ) {
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

    } else if (data[fromBase36(terms[0])]) {

      delete data[fromBase36(terms[0])]

    }

    return save(data)

  },

}

// Run from command-line
if (process.argv[2]) {

  const [command, ...args] = [
    ...process.argv[2].split(' '), ...process.argv.slice(3)
  ]

  if (func[command]) {

    func[command](...args)

  } else {

    help()

  }

} else {

  help()

}