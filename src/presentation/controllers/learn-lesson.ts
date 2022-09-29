import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { LearnLesson } from '@/domain/usecases'

export class LearnLessonController implements Controller {
  constructor (
    private readonly learnLesson: LearnLesson
  ) { }

  async handle (request: LearnLessonController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['lessonId']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const infos = await this.learnLesson.learn(request.lessonId)

      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LearnLessonController {
  export interface Request extends Controller.Request {
    lessonId: string
  }
}
