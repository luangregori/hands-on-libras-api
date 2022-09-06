import { TestResultModel } from '@/domain/models/test-result'

export interface LoadTestResultsRepository {
  findOrCreate: (accountId: string, challengeId: string) => Promise<TestResultModel>
}
