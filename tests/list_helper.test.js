const listHelper = require('../utils/list_helper')

const testArray1 = []
const testArray2 = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  }]
const testArray3 = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('dummy', () => {
  test('dummy is called', () => {
    const blogs = testArray1

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('totalLikes', () => {
  test('empty array', () => {
    const blogs = testArray1

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  }),

  test('one item', () => {
    const blogs = testArray2

    expect(listHelper.totalLikes(blogs)).toBe(7)
  }),

  test('full test array', () => {
    const blogs = testArray3
    
    expect(listHelper.totalLikes(blogs)).toBe(36)  
  })
})

describe('favoriteBlog', () => {
    test('empty array', () => {
    const blogs = testArray1

    const result = listHelper.favoriteBlog(blogs)
    expect(result).toBe(undefined)
  }),

  test('one item', () => {
    const blogs = testArray2

    expect(listHelper.favoriteBlog(blogs)).toEqual(blogs[0])
  }),

  test('full test array', () => {
    const blogs = testArray3

    const expectedValue = {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    }
    
    expect(listHelper.favoriteBlog(blogs)).toEqual(expectedValue)  
  })
})

describe('mostBlogs', () => {
  test('empty array', () => {
    const blogs = testArray1

    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual([])
  }),

  test('one item', () => {
    const blogs = testArray2
    const expected = [{
      author: "Michael Chan",
      count: 1 
    }]

    expect(listHelper.mostBlogs(blogs)).toEqual(expected)
  }),

  test('full test array', () => {
    const blogs = testArray3

    const expectedValue = [
      {"author": "Michael Chan", "count": 1}, 
      {"author": "Edsger W. Dijkstra", "count": 2}, 
      {"author": "Robert C. Martin", "count": 3}
    ]
    
    expect(listHelper.mostBlogs(blogs)).toEqual(expectedValue)  
  })
})

describe('mostLikes', () => {
  test('empty array', () => {
    const blogs = testArray1

    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(undefined)
  }),

  test('one item ', () => {
    const blogs = testArray2
    const expected = {
      author: "Michael Chan",
      likes: 7
    }

    expect(listHelper.mostLikes(blogs)).toEqual(expected)
  }),

  test('full test array', () => {
    const blogs = testArray3

    const expectedValue = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    
    expect(listHelper.mostLikes(blogs)).toEqual(expectedValue)  
  })
})