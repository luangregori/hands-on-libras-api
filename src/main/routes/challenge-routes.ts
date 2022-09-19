import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import {
  makeLoadChallengesController,
  makeStartChallengeController,
  makeLearnChallengeController,
  makeCompleteLearnController,
  makeTestChallengeController
} from '@/main/factories/challenge'

export default (router: Router): void => {
  router.post('/challenges', auth, adaptRoute(makeLoadChallengesController()))
  router.post('/challenge/start', auth, adaptRoute(makeStartChallengeController()))
  router.post('/challenge/learn', auth, adaptRoute(makeLearnChallengeController()))
  router.post('/challenge/learn/complete', auth, adaptRoute(makeCompleteLearnController()))
  router.post('/challenge/test', auth, adaptRoute(makeTestChallengeController()))
}
