const Link = require('../models/links')

const getAll = async () => {
  try {
    let linkList = await Link
      .find({})
      .sort('-added')
      .populate('user', { username: 1, name: 1 })
    linkList = linkList.map(link => Link.format(link))
    return linkList
  } catch (exc) {
    console.log(exc)
    return false
  }
}

const addLink = async (data) => {
  const link = new Link({
    url: data.url,
    description: data.description,
    user: data.userId
  })

  try {
    const response = await link
      .save()
      .then(link => link.populate('user', { username: 1, name: 1 }).execPopulate())
    const formattedLink = Link.format(response)
    return formattedLink
  } catch (exc) {
    console.log(exc)
    return false
  }
}

module.exports = { getAll, addLink }
