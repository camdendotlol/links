const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')

const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('pass', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('adding a post', () => {
  test('correct number of posts are returned', async () => {
    const returnedNotes = await helper.blogsInDb()
    expect(returnedNotes).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier is named id', async () => {
    const response = await api.get('/api/blogs/')
    expect(response.body[0].id).toBeDefined()
  })

  test('post requests successfully create new blog link', async () => {
    const newBlog = {
      title: 'Big Chungus: Game of the Century',
      author: 'Bugs Bunny',
      url: 'https://polygon.com/2020/10/5/42069/big-chungus-game-of-the-century',
      likes: 7
    }

    const response = await api
      .post('/api/login')
      .send({
        'username': 'root',
        'password': 'pass'
      })
      .expect(200)

    await api
      .post('/api/blogs')
      .set({ 'Authorization': `bearer ${response.body.token}` })
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('Big Chungus: Game of the Century')
  })

  test('if likes field is missing, default to 0', async () => {
    const newBlog = {
      title: 'Big Chungus: Game of the Century',
      author: 'Bugs Bunny',
      url: 'https://polygon.com/2020/10/5/42069/big-chungus-game-of-the-century',
    }

    const response = await api
      .post('/api/login')
      .send({
        'username': 'root',
        'password': 'pass'
      })
      .expect(200)

    await api
      .post('/api/blogs')
      .set({ 'Authorization': `bearer ${response.body.token}` })
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const returnedBlog = (await blogsAtEnd.filter(blog => blog.title === newBlog.title))[0]
    expect(returnedBlog.likes).toEqual(0)
  })

  test('returns 400 error when title and/or url are missing', async () => {
    const newBlog = {
      author: 'Bugs Bunny',
    }

    const response = await api
      .post('/api/login')
      .send({
        'username': 'root',
        'password': 'pass'
      })
      .expect(200)

    await api
      .post('/api/blogs')
      .set({ 'Authorization': `bearer ${response.body.token}` })
      .send(newBlog)
      .expect(400)
  })

  test('returns 401 error when token is missing', async () => {
    const newBlog = {
      title: 'Big Chungus: Game of the Century',
      author: 'Bugs Bunny',
      url: 'https://polygon.com/2020/10/5/42069/big-chungus-game-of-the-century',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set({ 'Authorization': 'bearer' })
      .send(newBlog)
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})