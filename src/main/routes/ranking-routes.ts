import { Router } from 'express'
import { auth } from '@/main/middlewares'
import { makeLoadRankingController } from '@/main/factories/ranking'
import { adaptRoute } from '@/main/adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/ranking', auth, adaptRoute(makeLoadRankingController()))
}
