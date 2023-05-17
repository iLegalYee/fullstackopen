import { useState, useEffect } from 'react'
import api from './services/api'
import './App.css'


const Filter = ({ searchTerm, handleSearchChange }) => {
    return (
        <div>
            filter shown with: <input value={searchTerm} onChange={handleSearchChange} />
        </div>
    )
}

const PersonList = ({ persons, handleDelete }) => {
    return (
        <div>
            {persons.map((person, index) =>
                <p key={index}>{person.name} {person.number} <button onClick={() => handleDelete(person.id)}>Delete</button></p>
            )}
        </div>
    )
}

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleSubmit }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                name: <input value={newName} onChange={handleNameChange} />
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        api.getAll().then(data => { setPersons(data) })
    }, [])

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const existingPerson = persons.find((person => person.name === newName))
        if (existingPerson) {
            const confirmUpdate = window.confirm(`${existingPerson.name} is already added to the phonebook. Replace the old number with a new one?`)

            if (confirmUpdate) {
                const updatedPerson = { ...existingPerson, number: newNumber }
                api.update(existingPerson.id, updatedPerson).then((data) => {
                    const updatedPersons = persons.map((person) =>
                        person.id === data.id ? data : person
                    )
                    setPersons(updatedPersons)
                    setNewName('')
                    setNewNumber('')
                    setSearchTerm('')
                    setNotification('Number updated succefully!')
                    setTimeout(() => {
                        setNotification(null);
                    }, 5000)
                })
                    .catch((error) => {
                        setError('Failed to update the number. It has been already deleted');
                        setTimeout(() => {
                            setNotification(null);
                        }, 5000);
                    })
            } 
        } else {
            const newPerson = { name: newName, number: newNumber }
            api.create(newPerson).then(data => {
                setPersons([...persons, data])
                setNewName('')
                setNewNumber('')
                setSearchTerm('')
                setNotification('Person added succefully!')
                setTimeout(() => {
                    setNotification(null);
                }, 5000)
            })
                .catch((error) => {
                    setError('Failed to add the person. Please try again.');
                    setTimeout(() => {
                        setNotification(null);
                    }, 5000);
                });
        }
    }

    const handleDelete = (id) => {
        const personToDelete = persons.find((person) => person.id === id)
        const confirmDelete = window.confirm(`Delete ${personToDelete.name}?`)

        if (confirmDelete) {
            api.deletePerson(id).then(() => {
                const updatedPersons = persons.filter((person) => person.id !== id);
                setPersons(updatedPersons)
                setNotification('Person deleted succefully!')
                setTimeout(() => {
                    setNotification(null);
                }, 5000)
            })
                .catch((error) => {
                    setError('Failed to delete the number. It has been already deleted.');
                    setTimeout(() => {
                        setNotification(null);
                    }, 5000);
                });
        }
    }

    const filteredPersons = persons.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )


    return (
        <div>
            <h2>Phonebook</h2>
            {notification && <div className="notification">{notification}</div>}
            {error && <div className="error">{error}</div>}
            <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
            <h1>Add a new</h1>
            <PersonForm newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} handleSubmit={handleSubmit} />
            <h2>Numbers</h2>
            <PersonList persons={filteredPersons} handleDelete={handleDelete} />
        </div>
    )
}

export default App



