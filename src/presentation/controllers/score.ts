import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadAccountScore } from '@/domain/usecases'

export class ScoreController implements Controller {
  constructor (
    private readonly loadAccountScore: LoadAccountScore
  ) { }

  async handle (request: ScoreController.Request): Promise<HttpResponse> {
    try {
      const infos = await this.loadAccountScore.load(request.accountId)

      return ok(infos)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace ScoreController {
  export interface Request extends Controller.Request { }
}
