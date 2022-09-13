import { TestResultModel } from '@/domain/models/test-result'

export interface LoadTestResultsRepository {
  findOrCreate: (accountId: string, challengeId: string) => Promise<TestResultModel>
  findByDate: (date: Date) => Promise<TestResultModel[]>
  findByAccountId: (userId: string) => Promise<TestResultModel[]>
}
