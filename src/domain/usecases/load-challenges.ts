import { ChallengeModel } from '@/domain/models/challenge'

export interface LoadChallenges {
  load: (categoryId?: string) => Promise<LoadChallenges.Result>
}

export namespace LoadChallenges {
  export type Result = ChallengeModel[]
}
