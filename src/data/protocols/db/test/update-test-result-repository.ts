import { TestResultModel } from '@/domain/models'

export interface UpdateTestResultRepository {
  update: (accountId: string, challengeId: string, keyToUpdate: string, valueToUpdate: string) => Promise<TestResultModel>
}
