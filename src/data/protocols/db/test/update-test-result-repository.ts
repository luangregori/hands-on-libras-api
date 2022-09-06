import { TestResultModel } from '@/domain/models'

export interface UpdateTestResultRepository {
  update: (testResultToUpdate: any) => Promise<TestResultModel>
}
