const _ = require('lodash')

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)

  const reducer = (sum, item) => {
    return sum + item
  }

  return likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  let mostLikes = 0
  let blogWithMostLikes = null

  blogs.forEach(blog => {
    if (blog.likes > mostLikes) {
      mostLikes = blog.likes
      blogWithMostLikes = blog
    }
  })

  return blogWithMostLikes
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author)
  const authorCounts = _.countBy(authors)

  const mostFrequentAuthor = _.maxBy(_.keys(authorCounts))

  return {
    'author': mostFrequentAuthor,
    'blog posts': authorCounts[mostFrequentAuthor]
  }
}

const mostLikes = (blogs) => {
  const authors = _.uniq(blogs.map(blog => blog.author))

  let authorLikes = authors.map(author => ({ name: author, likes: 0 }))

  authorLikes.forEach(author => {
    let sum = 0
    let blogsByAuthor = blogs.filter(blog => blog.author === author.name)
    blogsByAuthor.forEach(blog => {
      sum += blog.likes
    })
    author.likes = sum
  })

  const sortedAuthors = _.orderBy(authorLikes, ['likes'], ['desc'])

  const mostLikedAuthor = sortedAuthors[0]

  return {
    author: mostLikedAuthor.name,
    likes: mostLikedAuthor.likes
  }
}

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}