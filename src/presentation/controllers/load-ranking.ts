import { Controller, HttpResponse } from '@/presentation/protocols'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'
import { MissingParamError } from '@/presentation/errors'
import { LoadRanking } from '@/domain/usecases'

export class LoadRankingController implements Controller {
  constructor (
    private readonly loadRanking: LoadRanking
  ) {}

  async handle (request: LoadRankingController.Request): Promise<HttpResponse> {
    try {
      const requiredFields = ['days']
      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const params: LoadRanking.Params = request

      const ranking = await this.loadRanking.load(params)
      return ok(ranking)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadRankingController {
  export interface Request extends Controller.Request {
    days: number
  }
}
