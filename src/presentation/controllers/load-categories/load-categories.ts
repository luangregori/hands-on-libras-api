import { Controller, HttpRequest, HttpResponse, LoadCategories } from './load-categories-protocols'
import { ok, serverError, noContent } from '../../helpers/http-helper'

export class LoadCategoriesController implements Controller {
  constructor (
    private readonly loadCategories: LoadCategories
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const categories = await this.loadCategories.load()
      return categories.length ? ok(categories) : noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}