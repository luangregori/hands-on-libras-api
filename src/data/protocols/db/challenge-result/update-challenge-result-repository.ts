import { ChallengeResultModel } from '@/domain/models'

export interface UpdateChallengeResultRepository {
  update: (accountId: string, lessonId: string, updateChallengeResult: any) => Promise<ChallengeResultModel>
}
