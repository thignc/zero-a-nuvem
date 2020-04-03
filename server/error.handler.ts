import * as restify from 'restify'

export const handleError = (req: restify.Request, res: restify.Response, error, done) => {

  error.toJSON = () => {
    return {
      message: error.message
    }
  }
  switch (error.name) {
    case 'MongoError':
      if (error.code === 1100) {
        error.statusCode = 400
      }
      break
    case 'ValidationError':
      error.statusCode = 400
      
      // corpo do código para versões anteriores que não tinha tratamento de erro a erro, aparecia sempre o primeiro erro
      /* const messages: any[] = []
      for (let e in error.errors) {
        messages.push({ message: error.errors[e].message })
      }
      error.toJSON = () => {
        errors: messages
      } */
      break
  }
  done()
}