import { TestQuestionModel } from '@/domain/models'

export interface TestChallenge {
  test: (challengeId: string) => Promise<TestChallenge.Result>
}

export namespace TestChallenge {
  export type Result = TestQuestionModel[]
}
