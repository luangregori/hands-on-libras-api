import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { CompleteTest } from '@/domain/usecases'

export class CompleteTestController implements Controller {
  constructor (
    private readonly completeTest: CompleteTest
  ) { }

  async handle (request: CompleteTestController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['challengeId', 'lives']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const completeTestParams: CompleteTest.Params = request

      await this.completeTest.complete(completeTestParams)

      return ok()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace CompleteTestController {
  export interface Request extends Controller.Request {
    challengeId: string
    lives: number
  }
}
