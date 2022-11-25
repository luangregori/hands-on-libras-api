import { Router } from 'express'
import {
  makeLoginController,
  makeSignUpController,
  makeUserInfoController,
  makeUpdateUserInfoController,
  makeVerifyEmailController,
  makeRecoverPasswordController,
  makeConfirmCodeController,
  makeNewPasswordController
} from '@/main/factories/user'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
  router.post('/signup', adaptRoute(makeSignUpController()))
  router.post('/user-info', auth, adaptRoute(makeUserInfoController()))
  router.post('/update-user-info', auth, adaptRoute(makeUpdateUserInfoController()))
  router.get('/verify-email/:id', adaptRoute(makeVerifyEmailController()))
  router.post('/recover-password', adaptRoute(makeRecoverPasswordController()))
  router.post('/confirm-code', adaptRoute(makeConfirmCodeController()))
  router.post('/new-password', auth, adaptRoute(makeNewPasswordController()))
}
