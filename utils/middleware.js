const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log('virheen käsittelijässä')
  if(error.name === 'ValidationError') {
    console.log('validoinnissa meni jokin päin persettä')
    console.log('errori', error.message)
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  tokenExtractor,
  errorHandler
}