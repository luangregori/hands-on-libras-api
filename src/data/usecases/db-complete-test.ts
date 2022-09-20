import { CompleteTest } from '@/domain/usecases'
import { UpdateTestResultRepository, LoadTestResultsRepository } from '@/data/protocols'
import { StatusTestResult } from '@/domain/models'

export class DbCompleteTest implements CompleteTest {
  constructor (
    private readonly loadTestResultsRepository: LoadTestResultsRepository,
    private readonly updateTestResultsRepository: UpdateTestResultRepository
  ) { }

  async complete (completeTestParams: CompleteTest.Params): Promise<boolean> {
    const { accountId, challengeId, lives } = completeTestParams
    const testResult = await this.loadTestResultsRepository.findOrCreate(accountId, challengeId)
    // Se ja completou o desafio, não dá mais pontos
    if (testResult.status === StatusTestResult.COMPLETED) {
      return true
    }

    // Se acabou as vidas, reverte o status e não da pontos
    if (testResult.status === StatusTestResult.TESTED && lives === 0) {
      testResult.status = StatusTestResult.LEARNED
      await this.updateTestResultsRepository.update(accountId, challengeId, testResult)
      return true
    }

    // Da pontuação conforme a quantidade de vidas
    testResult.status = lives === 3 ? StatusTestResult.COMPLETED : StatusTestResult.TESTED
    testResult.score += lives === 3 ? 90 : lives * 30
    await this.updateTestResultsRepository.update(accountId, challengeId, testResult)
    return true
  }
}
