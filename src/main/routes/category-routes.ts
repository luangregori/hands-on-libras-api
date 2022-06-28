import { Router } from 'express'
import { makeFindAllCategoriesController } from '../factories/category'
import { adaptRoute } from '../adapters'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.get('/categories', auth, adaptRoute(makeFindAllCategoriesController()))
}
