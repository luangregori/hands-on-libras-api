import { ChallengeQuestionModel } from '@/domain/models'

export interface LoadChallengeQuestionRepository {
  findByLessonId: (lessonId: string) => Promise<ChallengeQuestionModel[]>
}
