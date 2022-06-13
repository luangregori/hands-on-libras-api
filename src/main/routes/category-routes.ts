/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { makeFindAllCategoriesController } from '../factories/category'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.get('/categories', adaptRoute(makeFindAllCategoriesController()))
}
