import { Collection } from 'mongodb'
import { MongoHelper, TestResultMongoRepository } from '@/infra/db'

let testResultCollection: Collection

describe('Test Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    testResultCollection = await MongoHelper.getCollection('test-results')
    await testResultCollection.deleteMany({})
  })

  const makeSut = (): TestResultMongoRepository => {
    return new TestResultMongoRepository()
  }

  describe('LoadTestResultsRepository implementation', () => {
    test('Should return an test result', async () => {
      await testResultCollection.insertOne({
        id: 'valid_id',
        accountId: 'valid_account_id',
        challengeId: 'valid_challenge_id',
        status: 'completed',
        score: '900'
      })
      const sut = makeSut()
      const result = await sut.findOrCreate('valid_account_id', 'valid_challenge_id')
      expect(result).toBeDefined()
      expect(result.accountId).toBe('valid_account_id')
      expect(result.challengeId).toBe('valid_challenge_id')
      expect(result.status).toBe('completed')
      expect(result.score).toBe('900')
    })

    test('Should create an test result', async () => {
      const sut = makeSut()
      const result = await sut.findOrCreate('valid_account_id', 'valid_challenge_id')
      expect(result).toBeDefined()
      expect(result.accountId).toBe('valid_account_id')
      expect(result.challengeId).toBe('valid_challenge_id')
      expect(result.status).toBe('started')
      expect(result.score).toBeUndefined()
    })
  })

  describe('UpdateTestResultRepository implementation', () => {
    test('Should return an test result updated', async () => {
      await testResultCollection.insertOne({
        id: 'valid_id',
        accountId: 'valid_account_id',
        challengeId: 'valid_challenge_id',
        status: 'completed',
        score: '900'
      })
      const sut = makeSut()
      const result = await sut.update('valid_account_id', 'valid_challenge_id', 'score', '1000')
      expect(result).toBeDefined()
      expect(result.score).toBe('1000')
    })
  })
})
