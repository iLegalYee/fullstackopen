const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const mostLikes = blogs.reduce((maxLikes, blog) => {
    return blog.likes > maxLikes ? blog.likes : maxLikes
  }, -Infinity)

  const mostLikedBlog = blogs.find(blog => blog.likes === mostLikes)
  return {
    title: mostLikedBlog.title,
    author: mostLikedBlog.author,
    likes: mostLikedBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = {}

  blogs.forEach((blog) => {
    if (blog.author in blogCounts) {
      blogCounts[blog.author]++
    } else {
      blogCounts[blog.author] = 1
    }
  })

  let topAuthor = ''
  let maxBlogs = -Infinity

  for (const author in blogCounts) {
    if (blogCounts[author] > maxBlogs) {
      topAuthor = author
      maxBlogs = blogCounts[author]
    }
  }
  return {
    author: topAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = {}

  blogs.forEach((blog) => {
    if (blog.author in likesByAuthor) {
      likesByAuthor[blog.author] += blog.likes
    } else {
      likesByAuthor[blog.author] = blog.likes
    }
  })

  let topAuthor = ''
  let maxLikes = -Infinity

  for (const author in likesByAuthor) {
    if (likesByAuthor[author] > maxLikes) {
      maxLikes = likesByAuthor[author]
      topAuthor = author
    }
  }

  return {
    author: topAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
