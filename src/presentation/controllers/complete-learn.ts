import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { CompleteLearn } from '@/domain/usecases'

export class CompleteLearnController implements Controller {
  constructor (
    private readonly completeLearn: CompleteLearn
  ) { }

  async handle (request: CompleteLearnController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['challengeId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      await this.completeLearn.complete(request.challengeId)

      return ok()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace CompleteLearnController {
  export interface Request extends Controller.Request {
    challengeId: string
  }
}
