import { ChallengeResultModel } from '@/domain/models'

export interface LoadChallengeResultsRepository {
  findOrCreate: (accountId: string, lessonId: string) => Promise<ChallengeResultModel>
  findByDate: (date: Date) => Promise<ChallengeResultModel[]>
  findByDateAndAccountId: (date: Date, accountId: string) => Promise<ChallengeResultModel[]>
  findByAccountId: (userId: string) => Promise<ChallengeResultModel[]>
}
