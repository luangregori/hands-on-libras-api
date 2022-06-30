import { Router } from 'express'
import { makeLoginController } from '@/main/factories/login'
import { adaptRoute } from '@/main/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
