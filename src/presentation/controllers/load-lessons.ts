import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadLessons } from '@/domain/usecases'

export class LoadLessonsController implements Controller {
  constructor (
    private readonly loadLessons: LoadLessons
  ) {}

  async handle (request: LoadLessonsController.Request): Promise<HttpResponse> {
    try {
      const lessons = await this.loadLessons.load(request.categoryId)
      return ok(lessons)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadLessonsController {
  export interface Request extends Controller.Request {
    categoryId?: string
  }
}
