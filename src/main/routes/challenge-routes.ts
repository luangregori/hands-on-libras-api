import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares/auth'
import { makeLoadChallengesController } from '@/main/factories/challenge'

export default (router: Router): void => {
  router.post('/challenges', auth, adaptRoute(makeLoadChallengesController()))
}
