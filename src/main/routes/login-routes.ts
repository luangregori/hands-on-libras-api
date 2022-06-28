import { Router } from 'express'
import { makeLoginController } from '../factories/login'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
