import { TestChallenge } from '@/domain/usecases'
import { UpdateTestResultRepository, LoadTestQuestionRepository, LoadTestResultsRepository } from '@/data/protocols'
import { StatusTestResult } from '@/domain/models'

export class DbTestChallenge implements TestChallenge {
  constructor (
    private readonly loadTestResultsRepository: LoadTestResultsRepository,
    private readonly updateTestResultsRepository: UpdateTestResultRepository,
    private readonly loadTestQuestionRepository: LoadTestQuestionRepository
  ) { }

  async test (params: TestChallenge.Params): Promise<TestChallenge.Result> {
    const { accountId, challengeId } = params
    const testResult = await this.loadTestResultsRepository.findOrCreate(accountId, challengeId)

    // Se o test já for completo, não altera o status novamente
    testResult.status = testResult.status === StatusTestResult.COMPLETED
      ? StatusTestResult.COMPLETED
      : StatusTestResult.TESTED

    await this.updateTestResultsRepository.update(params.accountId, params.challengeId, testResult)
    const questions = await this.loadTestQuestionRepository.findByChallengeId(params.challengeId)
    return questions
  }
}
