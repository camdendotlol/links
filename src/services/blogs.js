import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getOne = async id => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const toggleLike = async blogObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(`${baseUrl}/${blogObject.id}/like`, null, config)
  console.log(response.data)
  return response.data
}

// const unlike = async blogObject => {
//   const config = {
//     headers: { Authorization: token }
//   }

//   const blogToUnlike = { ...blogObject, likes: blogObject.likes - 1 }

//   const response = await axios.put(`${baseUrl}/${blogObject.id}`, blogToUnlike, config)
//   return response.data
// }

const addComment = async (comment, linkId) => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(`${baseUrl}/${linkId}/comments`, comment, config)
  return response.data
}

const deleteBlog = async blog => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.delete(`${baseUrl}/${blog}`, config)
  return response.data
}

export default { getAll, getOne, create, setToken, toggleLike, addComment, deleteBlog }