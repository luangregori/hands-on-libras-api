import { TestResultModel } from '@/domain/models/test-result'

export interface LoadTestResultsRepository {
  load: (accountId: string, challengeId: string) => Promise<TestResultModel>
}
