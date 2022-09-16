import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { TestChallenge } from '@/domain/usecases'

export class TestChallengeController implements Controller {
  constructor (
    private readonly testChallenge: TestChallenge
  ) { }

  async handle (request: TestChallengeController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['challengeId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const infos = await this.testChallenge.test(request.challengeId)

      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace TestChallengeController {
  export interface Request extends Controller.Request {
    challengeId: string
  }
}
