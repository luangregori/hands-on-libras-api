import { LearningInfoModel } from '@/domain/models'

export interface LearnChallenge {
  learn: (challengeId: string) => Promise<LearnChallenge.Result>
}

export namespace LearnChallenge {
  export type Result = LearningInfoModel[]
}
