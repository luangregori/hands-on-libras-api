import { CompleteLearn } from '@/domain/usecases'
import { UpdateTestResultRepository, LoadTestResultsRepository } from '@/data/protocols'
import { StatusTestResult } from '@/domain/models'

export class DbCompleteLearn implements CompleteLearn {
  constructor (
    private readonly loadTestResultsRepository: LoadTestResultsRepository,
    private readonly updateTestResultsRepository: UpdateTestResultRepository
  ) { }

  async complete (completeLearnParams: CompleteLearn.Params): Promise<boolean> {
    const { accountId, challengeId } = completeLearnParams
    const testResult = await this.loadTestResultsRepository.findOrCreate(accountId, challengeId)
    if (testResult.status === StatusTestResult.STARTED) {
      const testResultToUpdate = {
        status: StatusTestResult.LEARNED,
        score: testResult.score + 10
      }
      await this.updateTestResultsRepository.update(accountId, challengeId, testResultToUpdate)
    }
    return true
  }
}
