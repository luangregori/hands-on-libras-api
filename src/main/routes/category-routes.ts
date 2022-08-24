import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import { makeFindAllCategoriesController } from '@/main/factories/category'

export default (router: Router): void => {
  router.get('/categories', auth, adaptRoute(makeFindAllCategoriesController()))
}
