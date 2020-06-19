import { Router } from './router'
import { NotFoundError } from 'restify-errors'
import * as mongoose from 'mongoose'

export abstract class  ModelRouter<D extends mongoose.Document> extends Router {

  basePath: string
  pageSize: number = 4 

  constructor(protected model: mongoose.Model<D>) {
    super()
    this.basePath = `/${model.collection.name}`
  }

  protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D, D> {
    return query
  }

  envelop(document: any): any {
    let resource = Object.assign({
      _links: {}
    }, document.toJSON())
    resource._links.self = `${this.basePath}/${resource._id}`
    return resource
  }

  envelopAll(documents: any, options: any = {}): any {
    const resource: any = {
      _links: {
        self: `${options.requestUrl}`,
      },
      itens: documents,
    }
    if(options.page) {
      const needAnotherPage = (options.count % options.pageSize) > 0
        ? 1
        : 0
      const lastPage = Math.floor(options.count / options.pageSize) + needAnotherPage
      if(options.page > 1) {
        resource._links.previous = `${this.basePath}?_page=${options.page - 1}`
      }
      const next = Number(`${this.basePath}?_page=${options.page + 1}`) > lastPage
        ? lastPage
        : Number(`${this.basePath}?_page=${options.page + 1}`)
      resource._links.next = next

    }
    return resource
  }

  validateID = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      next(new NotFoundError('Document not found.'))
    } else {
      next()
    }
  }

  findAll = (req, res, next) => {
    let page = parseInt(req.query._page || 1)
    page = page > 0
      ? page
      : 0

    const totalRecordsToSkip = (page - 1) * this.pageSize

    this.model
    .count({}).exec()
    .then(count => this.model.find()
        .skip(totalRecordsToSkip)
        .limit(this.pageSize)
        .then(this.renderAll(res, next, { 
          page,
          count,
          pageSize: this.pageSize,
          requestUrl: req.url,
        })))
    
      .catch(next)
  }

  findById = (req, res, next) => {
    this.prepareOne(this.model.findById(req.params.id))
      .then(this.render(res, next))
      .catch(next)
  }

  save = (req, res, next) => {
    let document = new this.model(req.body)
    document.save()
      .then(this.render(res, next))
      .catch(next)
  }

  replace = (req, res, next) => {
    const options = { overwrite: true, runValidators: true }
    this.model.update({ _id: req.params.id}, req.body, options)
        .exec().then(result => {
          if(result.n) {
            return this.model.findById(req.params.id).exec()
          } else {
            throw new NotFoundError('Documento não encontrado')
          }
        })
          .then(this.render(res, next))
          .catch(next)
  }

  update = (req, res, next) => {
    const options = { new: true, runValidators: true }
    this.model.findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(res, next))
      .catch(next)
  }

  delete = (req, res, next) => {
    this.model.remove({_id: req.params.id} )
    .exec()
    .then((commandResult: any) => {
      if (commandResult.result.n) {
        res.send(204)
      } else {
        throw new NotFoundError('Documento não encontrado')
      }        
      return next()
    })
  }
}