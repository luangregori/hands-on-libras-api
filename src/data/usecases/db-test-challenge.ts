import { TestChallenge } from '@/domain/usecases'
import { UpdateTestResultRepository, LoadTestQuestionRepository } from '@/data/protocols'
import { StatusTestResult } from '@/domain/models'

export class DbTestChallenge implements TestChallenge {
  constructor (
    private readonly updateTestResultsRepository: UpdateTestResultRepository,
    private readonly loadTestQuestionRepository: LoadTestQuestionRepository
  ) { }

  async test (params: TestChallenge.Params): Promise<TestChallenge.Result> {
    const testResultToUpdate = {
      status: StatusTestResult.TESTED
    }
    await this.updateTestResultsRepository.update(params.accountId, params.challengeId, testResultToUpdate)
    const questions = await this.loadTestQuestionRepository.findByChallengeId(params.challengeId)
    return questions
  }
}
