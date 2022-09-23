import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { StartLesson } from '@/domain/usecases'

export class StartLessonController implements Controller {
  constructor (
    private readonly startLesson: StartLesson
  ) {}

  async handle (request: StartLessonController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['lessonId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const startLessonParams: StartLesson.Params = request

      const infos = await this.startLesson.start(startLessonParams)

      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace StartLessonController {
  export interface Request extends Controller.Request {
    lessonId: string
  }
}
