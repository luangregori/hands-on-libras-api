import { Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import {
  makeLoadLessonController,
  makeStartLessonController,
  makeLearnLessonController,
  makeCompleteLearnController,
  makeChallengeLessonController,
  makeCompleteChallengeController
} from '@/main/factories/lesson'

export default (router: Router): void => {
  router.post('/lessons', auth, adaptRoute(makeLoadLessonController()))
  router.post('/lesson/start', auth, adaptRoute(makeStartLessonController()))
  router.post('/lesson/learn', auth, adaptRoute(makeLearnLessonController()))
  router.post('/lesson/learn/complete', auth, adaptRoute(makeCompleteLearnController()))
  router.post('/lesson/challenge', auth, adaptRoute(makeChallengeLessonController()))
  router.post('/lesson/challenge/complete', auth, adaptRoute(makeCompleteChallengeController()))
}
