const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.ulvgonl.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) { // Display all entries in the phonebook
  console.log('Phonebook:')
  Person.find({})
    .then((persons) => {
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
    .catch((error) => {
      console.log('Error retrieving phonebook entries:', error.message)
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) { // Add a new entry to the phonebook
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number
  })

  person.save()
    .then(() => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((error) => {
      console.log('Error saving phonebook entry:', error.message)
      mongoose.connection.close()
    })
} else {
  console.log('Invalid number of arguments.')
  mongoose.connection.close()
}
