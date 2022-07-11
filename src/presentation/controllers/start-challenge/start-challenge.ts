import { Controller, HttpResponse, StartChallenge } from './start-challenge-protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'

export class StartChallengeController implements Controller {
  constructor (
    private readonly startChallenge: StartChallenge
  ) {}

  async handle (request: StartChallengeController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['challengeId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const startChallengeParams: StartChallenge.Params = request

      const infos = await this.startChallenge.start(startChallengeParams)

      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace StartChallengeController {
  export interface Request extends Controller.Request {
    challengeId: string
  }
}
