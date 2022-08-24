import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError, noContent } from '@/presentation/helpers/http-helper'
import { LoadCategories } from '@/domain/usecases'

export class LoadCategoriesController implements Controller {
  constructor (
    private readonly loadCategories: LoadCategories
  ) {}

  async handle (request: LoadCategoriesController.Request): Promise<HttpResponse> {
    try {
      const categories = await this.loadCategories.load()
      return categories.length ? ok(categories) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadCategoriesController {
  export interface Request extends Controller.Request {}
}
