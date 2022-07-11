import { ChallengeModel } from '../models/challenge'

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
    userInfo: {
      completed: boolean
      score?: number
    }
  }
}
