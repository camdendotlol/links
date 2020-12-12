const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')
const api = supertest(app) //eslint-disable-line

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('total likes', () => {

  test('of empty list is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const singleBlogList = [helper.initialBlogs[0]]
    expect(listHelper.totalLikes(singleBlogList)).toBe(7)
  })

  test('of a bigger list is calculated correctly', async () => {
    expect(listHelper.totalLikes(helper.initialBlogs)).toBe(36)
  })
})

describe('most likes', () => {

  test('blog with the most likes', () => {
    expect(listHelper.favoriteBlog(helper.initialBlogs)).toEqual(
      { _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0 }
    )
  })

  test('author with most overall likes', () => {
    expect(listHelper.mostLikes(helper.initialBlogs)).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    )
  })
})

describe('most blogs', () => {
  test('author of the largest number of blog posts', () => {
    expect(listHelper.mostBlogs(helper.initialBlogs)).toEqual(
      {
        'author': 'Robert C. Martin',
        'blog posts': 3
      }
    )
  })
})

afterAll(() => {
  mongoose.connection.close()
})