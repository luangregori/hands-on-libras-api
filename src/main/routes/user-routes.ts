import { Router } from 'express'
import { makeLoginController, makeSignUpController, makeUserInfoController } from '@/main/factories/user'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/user-info', auth, adaptRoute(makeUserInfoController()))
}