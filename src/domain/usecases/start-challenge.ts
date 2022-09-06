import { ChallengeModel } from '../models/challenge'
import { TestResultModel } from '../models/test-result'

export interface StartChallenge {
  start: (startChallengeParams: StartChallenge.Params) => Promise<StartChallenge.Result>
}

export namespace StartChallenge {
  export interface Params {
    challengeId: string
    accountId: string
  }

  export interface Result {
    challengeInfo: ChallengeModel
    userInfo: TestResultModel
  }
}
