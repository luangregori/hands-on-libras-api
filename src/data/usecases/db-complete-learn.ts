import { CompleteLearn } from '@/domain/usecases'
import { UpdateTestResultRepository } from '@/data/protocols'
import { StatusTestResult } from '@/domain/models'

export class DbCompleteLearn implements CompleteLearn {
  constructor (
    private readonly updateTestResultsRepository: UpdateTestResultRepository
  ) { }

  async complete (completeLearnParams: CompleteLearn.Params): Promise<boolean> {
    const { accountId, challengeId } = completeLearnParams
    await this.updateTestResultsRepository.update(accountId, challengeId, 'status', StatusTestResult.LEARNED)
    return true
  }
}
