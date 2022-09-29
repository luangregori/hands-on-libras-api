import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { ChallengeLesson } from '@/domain/usecases'

export class ChallengeLessonController implements Controller {
  constructor (
    private readonly challengeLesson: ChallengeLesson
  ) { }

  async handle (request: ChallengeLessonController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['lessonId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const challengeLessonParams: ChallengeLesson.Params = request

      const infos = await this.challengeLesson.test(challengeLessonParams)

      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace ChallengeLessonController {
  export interface Request extends Controller.Request {
    lessonId: string
  }
}
