import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { CompleteLearn, CheckAchievements } from '@/domain/usecases'

export class CompleteLearnController implements Controller {
  constructor (
    private readonly completeLearn: CompleteLearn,
    private readonly checkAchievements: CheckAchievements
  ) { }

  async handle (request: CompleteLearnController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['lessonId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const completeLearnParams: CompleteLearn.Params = request

      await this.completeLearn.complete(completeLearnParams)
      await this.checkAchievements.check(request.accountId)

      return ok()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace CompleteLearnController {
  export interface Request extends Controller.Request {
    lessonId: string
  }
}
