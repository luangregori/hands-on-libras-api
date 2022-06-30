import { Controller, HttpResponse, LoadChallenges } from './load-challenges-protocols'
import { ok, serverError, noContent } from '@/presentation/helpers/http-helper'

export class LoadChallengesController implements Controller {
  constructor (
    private readonly loadChallenges: LoadChallenges
  ) {}

  async handle (request: LoadChallengesController.Request): Promise<HttpResponse> {
    try {
      const challenges = await this.loadChallenges.load(request.categoryId)
      return challenges.length ? ok(challenges) : noContent()
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
