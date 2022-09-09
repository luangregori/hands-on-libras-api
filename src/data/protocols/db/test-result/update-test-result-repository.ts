import { TestResultModel } from '@/domain/models'

export interface UpdateTestResultRepository {
  update: (accountId: string, challengeId: string, updateTestResult: any) => Promise<TestResultModel>
}
