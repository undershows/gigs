import meow from 'meow'
import dayjs from 'dayjs'
import inquirer from 'inquirer'
import DatePrompt from 'inquirer-date-prompt'
import AutoCompletePrompt from 'inquirer-autocomplete-prompt'
import states from './data/states.js'
import { add } from './gig/collection.js'

const cli = meow(`
  Usage
    $ node ./add.js
`, {
  importMeta: import.meta
})

inquirer.registerPrompt('date', DatePrompt)
inquirer.registerPrompt('autocomplete', AutoCompletePrompt)

const answers = await inquirer.prompt([
  {
    name: 'state',
    type: 'autocomplete',
    loop: false,
    message: 'Em qual estado é o show/festival?',
    source: (_, input) => 
      states
        .filter((state) => state.abbr.match(input) || state.name.match(input))
        .map((state) => ({ ...state, value: state.abbr }))
  },
  {
    name: 'city',
    type: 'input',
    message: 'Cidade?'
  },
  {
    name: 'date',
    type: 'date',
    locale: 'pt-BR',
    format: { day: '2-digit', month: 'short' },
    default: dayjs().startOf('day').toDate(),
    message: 'Data e horário?'
  },
  {
    name: 'posterUrl',
    type: 'input',
    message: 'Qual a URL do cartaz?',
    validate: (input) => !!input.match(/^https?:/) || 'URL inválida.'
  }
])

await add(answers)