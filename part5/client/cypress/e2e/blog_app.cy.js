describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'testuser',
      password: 'testpassword',
      name: 'Test User'
    })

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('Login')
      .should('be.visible')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('testpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in')
        .should('be.visible')
    })

    it('fails with wrong credentials', function () {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('wrongpassword')
      cy.get('button[type="submit"]').click()

      cy.get('.errorMessage')
        .should('have.class', 'errorMessage')
        .and('contain', 'Wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    it('A blog can be created', function () {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('testpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in')
        .should('be.visible')
      const blogTitle = 'title'
      const blogAuthor = 'author'
      const blogUrl = 'url'

      cy.contains('New Blog').click()
      cy.get('input[name="newBlogTitle"]').type(blogTitle)
      cy.get('input[name="newBlogAuthor"]').type(blogAuthor)
      cy.get('input[name="newBlogUrl"]').type(blogUrl)
      cy.get('#create').click()

      cy.contains(`${blogTitle} by ${blogAuthor}`).should('be.visible')
    })

    it('A blog can be liked', function () {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('testpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in')
        .should('be.visible')
      const blogTitle = 'title'
      const blogAuthor = 'author'
      const blogUrl = 'url'

      cy.contains('New Blog').click()
      cy.get('input[name="newBlogTitle"]').type(blogTitle)
      cy.get('input[name="newBlogAuthor"]').type(blogAuthor)
      cy.get('input[name="newBlogUrl"]').type(blogUrl)
      cy.get('#create').click()

      cy.contains(`${blogTitle} by ${blogAuthor}`).should('be.visible')

      cy.contains(`${blogTitle} by ${blogAuthor}`)
        .parent()
        .find('button')
        .contains('View')
        .click()

      cy.contains('Likes: 0')
        .parent()
        .find('button')
        .contains('Like')
        .click()

      cy.contains('Likes: 1').should('be.visible')
    })

    it('A user can delete their own blog', function () {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('testpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in').should('be.visible')

      const blogTitle = 'title'
      const blogAuthor = 'author'
      const blogUrl = 'url'

      cy.contains('New Blog').click()
      cy.get('input[name="newBlogTitle"]').type(blogTitle)
      cy.get('input[name="newBlogAuthor"]').type(blogAuthor)
      cy.get('input[name="newBlogUrl"]').type(blogUrl)
      cy.get('#create').click()

      cy.contains(`${blogTitle} by ${blogAuthor}`).should('be.visible')

      cy.contains(`${blogTitle} by ${blogAuthor}`)
        .parent()
        .find('button')
        .contains('View')
        .click()

      cy.contains('Delete').click()

      cy.contains(`${blogTitle} by ${blogAuthor}`).should('not.exist')
    })

    it('Only the creator can see the delete button of a blog', function () {
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('testpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in').should('be.visible')

      const blogTitle = 'title'
      const blogAuthor = 'author'
      const blogUrl = 'url'

      cy.contains('New Blog').click()
      cy.get('input[name="newBlogTitle"]').type(blogTitle)
      cy.get('input[name="newBlogAuthor"]').type(blogAuthor)
      cy.get('input[name="newBlogUrl"]').type(blogUrl)
      cy.get('#create').click()

      cy.contains(`${blogTitle} by ${blogAuthor}`).should('be.visible')
      cy.contains(`${blogTitle} by ${blogAuthor}`)
        .parent()
        .find('button')
        .contains('View')
        .click()
      cy.contains('Delete').should('be.visible')

      cy.contains('Logout').click()

      cy.request('POST', 'http://localhost:3003/api/users', {
        username: 'anotheruser',
        password: 'anotherpassword',
        name: 'Another User'
      })

      cy.get('input[name="username"]').type('anotheruser')
      cy.get('input[name="password"]').type('anotherpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Another User logged in').should('be.visible')

      cy.contains(`${blogTitle} by ${blogAuthor}`)
        .parent()
        .find('button')
        .contains('View')
        .click()

      cy.contains('Delete').should('not.exist')
    })

    it('Blogs are ordered according to likes', function () {
      // Create a user
      cy.get('input[name="username"]').type('testuser')
      cy.get('input[name="password"]').type('testpassword')
      cy.get('button[type="submit"]').click()

      cy.contains('Test User logged in').should('be.visible')

      // Create blogs with different numbers of initial likes
      const blogs = [
        { title: 'Blog 1', author: 'Author 1', url: 'url1', initialLikes: 10 },
        { title: 'Blog 2', author: 'Author 2', url: 'url2', initialLikes: 5 },
        { title: 'Blog 3', author: 'Author 3', url: 'url3', initialLikes: 15 },
        { title: 'Blog 4', author: 'Author 4', url: 'url4', initialLikes: 8 }
      ]

      cy.contains('New Blog').click()
      cy.wrap(blogs).each(function (blog) {
        cy.get('input[name="newBlogTitle"]').type(blog.title)
        cy.get('input[name="newBlogAuthor"]').type(blog.author)
        cy.get('input[name="newBlogUrl"]').type(blog.url)
        cy.get('#create').click()

        // Increment the likes of the created blog
        cy.contains(`${blog.title} by ${blog.author}`)
          .find('button')
          .contains('View')
          .click()

        // Increment the likes by pressing the "Like" button multiple times
        for (let i = 0; i < blog.initialLikes; i++) {
          cy.contains(`Likes: ${i}`).should('be.visible')
          cy.contains('Like').click()
        }
        cy.contains('Hide Details').click()
      })
      cy.get('.blog')
      cy.get('.blog').eq(0).should('contain', 'Blog 3')
      cy.get('.blog').eq(1).should('contain', 'Blog 1')
      cy.get('.blog').eq(2).should('contain', 'Blog 4')
      cy.get('.blog').eq(3).should('contain', 'Blog 2')
    })
  })
})
