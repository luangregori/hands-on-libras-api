import { TestQuestionModel } from '@/domain/models'

export interface LoadTestQuestionRepository {
  findByChallengeId: (challengeId: string) => Promise<TestQuestionModel[]>
}
