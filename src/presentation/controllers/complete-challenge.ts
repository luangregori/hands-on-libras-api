import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { CompleteChallenge } from '@/domain/usecases'

export class CompleteChallengeController implements Controller {
  constructor (
    private readonly completeChallenge: CompleteChallenge
  ) { }

  async handle (request: CompleteChallengeController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['lessonId', 'lives']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { lessonId, accountId, lives } = request
      const completeChallengeParams: CompleteChallenge.Params = { lessonId, accountId, lives: Number(lives) }

      await this.completeChallenge.complete(completeChallengeParams)

      return ok()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace CompleteChallengeController {
  export interface Request extends Controller.Request {
    lessonId: string
    lives: string
  }
}
