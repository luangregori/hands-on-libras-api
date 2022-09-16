import { TestQuestionModel } from '@/domain/models'

export interface TestChallenge {
  test: (testChallengeParams: TestChallenge.Params) => Promise<TestChallenge.Result>
}

export namespace TestChallenge {
  export interface Params {
    challengeId: string
    accountId: string
  }

  export type Result = TestQuestionModel[]
}
