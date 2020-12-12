const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  console.log(body)

  if (body.invite_key !== config.INVITE_KEY) {
    return response.status(401).json({
      error: 'registration requires a correct invite key'
    })
  }

  if (!body.password || body.password.length < 3) {
    return response.status(400).json({
      error: 'must include password of at least 3 characters'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
    likes: []
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1 })

  response.json(users)
})

module.exports = usersRouter