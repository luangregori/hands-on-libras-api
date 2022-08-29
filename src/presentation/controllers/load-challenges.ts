import { Controller, HttpResponse } from '@/presentation/protocols'
import { ok, serverError } from '@/presentation/helpers/http-helper'
import { LoadChallenges } from '@/domain/usecases'

export class LoadChallengesController implements Controller {
  constructor (
    private readonly loadChallenges: LoadChallenges
  ) {}

  async handle (request: LoadChallengesController.Request): Promise<HttpResponse> {
    try {
      const challenges = await this.loadChallenges.load(request.categoryId)
      return ok(challenges)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace LoadChallengesController {
  export interface Request extends Controller.Request {
    categoryId?: string
  }
}
