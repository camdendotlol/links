describe('blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Test User',
      username: 'testuser',
      password: 'testtest',
      invite_key: Cypress.env('INVITE_KEY'),
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3001')
  })

  it('login form is shown', function() {
    cy.contains('Welcome. Please sign in to view this application')
    cy.contains('Username')
    cy.contains('Password')
  })

  describe('login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('testtest')
      cy.get('#submitLogin').click()

      cy.contains('Hello, Test User')
    })

    it('fails with incorrect credentials', function() {
      cy.get('#username').type('testuser')
      cy.get('#password').type('wrongpassword')
      cy.get('#submitLogin').click()

      cy.contains('Invalid credentials')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testuser', password: 'testtest' })

      cy.addBlog({ title: 'test blog 1', author: 'test author 1', url: 'google.com' })
    })

    it('user can create a new blog', function() {
      cy.get('#addBlog').click()
      cy.get('#newBlogTitle').type('test blog 2')
      cy.get('#newBlogAuthor').type('test author 2')
      cy.get('#newBlogUrl').type('duckduckgo.com')
      cy.get('#submitBlog').click()
      cy.contains('Added')
      cy.contains('test blog 2')
      cy.contains('test author 2')
    })

    it('first blog is still available in list after creation of second blog', function() {
      cy.get('#addBlog').click()
      cy.get('#newBlogTitle').type('test blog 2')
      cy.get('#newBlogAuthor').type('test author')
      cy.get('#newBlogUrl').type('duckduckgo.com')
      cy.get('#submitBlog').click()

      cy.contains('test blog 1')
      cy.contains('test author 1')
    })

    it('user can like a blog', function() {
      cy.contains('test blog 1').click()
      cy.contains('0 likes').should('be.visible')
      cy.contains('0 likes').click()
      cy.contains('1 like')
    })

    it('user can delete a blog that they created', function() {
      cy.contains('test blog 1').click()
      cy.get('.bi-trash-fill').click()
      cy.contains('Deleted test blog 1')
    })

    it('user cannot delete a blog that they did not create', function() {
      cy.contains('Log out').click()

      const user = {
        name: 'Second User',
        username: 'seconduser',
        password: '2two2two2two',
        invite_key: Cypress.env('INVITE_KEY')
      }
      cy.request('POST', 'http://localhost:3001/api/users/', user)
      cy.login({ username: 'seconduser', password: '2two2two2two' })

      cy.contains('test blog 1').click()
      cy.get('.bi-trash-fill').should('not.exist')
      cy.contains('Links').click()
      cy.contains('test blog 1')
    })

    // test is no longer applicable with current UI,
    // keeping for posterity

    // it.only('blogs are ordered by likes in descending order', function() {
    //   cy.addBlog({ title: 'huh', author: 'huhh', url: 'google.com', likes: 2 })
    //   cy.addBlog({ title: 'yeet', author: 'Mr. Yeet', url: 'bing.com', likes: 100 })
    //   cy.addBlog({ title: 'ahhhhhhh', author: 'ummmmmmmmmm', url: 'yahoo.com', likes: 42 })
    //   cy.addBlog({ title: 'i hate tests', author: 'Mr. Test', url: 'ddg.gg', likes: 10000 })

    //   cy.get('.blogItem')
    //     .then(blogs => {
    //       cy.get(blogs[0]).contains('i hate tests')
    //       cy.get(blogs[1]).contains('yeet')
    //       cy.get(blogs[2]).contains('ahhhhhhh')
    //       cy.get(blogs[3]).contains('huh')
    //     })
    // })
  })
})