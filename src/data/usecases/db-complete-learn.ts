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
      await this.updateTestResultsRepository.update(accountId, challengeId, 'status', StatusTestResult.LEARNED)
      const newScore = testResult.score + 10
      await this.updateTestResultsRepository.update(accountId, challengeId, 'score', newScore)
    }
    return true
  }
}
