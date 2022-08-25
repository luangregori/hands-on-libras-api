import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { LearnChallenge } from '@/domain/usecases'

export class LearnChallengeController implements Controller {
  constructor (
    private readonly learnChallenge: LearnChallenge
  ) { }

  async handle (request: LearnChallengeController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['challengeId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const infos = await this.learnChallenge.learn(request.challengeId)

      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LearnChallengeController {
  export interface Request extends Controller.Request {
    challengeId: string
  }
}
