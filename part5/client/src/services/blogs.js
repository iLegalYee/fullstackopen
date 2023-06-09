import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog)
  return response.data
}

const deleteBlog = async (blogId) => {
  const config = {
    headers: { Authorization: token }
  }

  await axios.delete(`${baseUrl}/${blogId}`, config)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create, update, deleteBlog }
