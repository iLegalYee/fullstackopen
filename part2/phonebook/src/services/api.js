import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
}

const create = (newPerson) => {
    return axios.post(baseUrl, newPerson).then(response => response.data)
}

const deletePerson = (id) => {
    const url = `${baseUrl}/${id}`
    return axios.delete(url)
}

const update = (id, updatedPerson) => {
    const url = `${baseUrl}/${id}`
    return axios.put(url,updatedPerson).then((response => response.data))
}

export default { getAll, create, deletePerson, update}