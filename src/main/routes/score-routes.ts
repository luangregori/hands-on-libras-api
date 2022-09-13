import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { makeScoreController } from '@/main/factories/score'
import { adaptRoute } from '@/main/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/score', auth, adaptRoute(makeScoreController()))
}
