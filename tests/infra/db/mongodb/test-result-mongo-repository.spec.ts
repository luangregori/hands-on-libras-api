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
        score: 900
      })
      const sut = makeSut()
      const result = await sut.findOrCreate('valid_account_id', 'valid_challenge_id')
      expect(result).toBeDefined()
      expect(result.accountId).toBe('valid_account_id')
      expect(result.challengeId).toBe('valid_challenge_id')
      expect(result.status).toBe('completed')
      expect(result.score).toBe(900)
    })

    test('Should create an test result', async () => {
      const sut = makeSut()
      const result = await sut.findOrCreate('valid_account_id', 'valid_challenge_id')
      expect(result).toBeDefined()
      expect(result.accountId).toBe('valid_account_id')
      expect(result.challengeId).toBe('valid_challenge_id')
      expect(result.status).toBe('started')
      expect(result.score).toBe(0)
    })

    test('Should return an test result on findByDate if dateToSearch is GTE updatedAt', async () => {
      const now = new Date()
      await testResultCollection.insertOne({
        id: 'valid_id',
        accountId: 'valid_account_id',
        challengeId: 'valid_challenge_id',
        status: 'completed',
        score: 900,
        updatedAt: now
      })
      const sut = makeSut()
      const dateToSearch = new Date(now.setDate(now.getDate() - 7))
      const result = await sut.findByDate(dateToSearch)
      expect(result).toBeDefined()
      expect(result[0].accountId).toBe('valid_account_id')
      expect(result[0].challengeId).toBe('valid_challenge_id')
      expect(result[0].status).toBe('completed')
      expect(result[0].score).toBe(900)
    })

    test('Should NOT return an test result on findByDate if dateToSearch is NOT GTE updatedAt', async () => {
      const now = new Date()
      await testResultCollection.insertOne({
        id: 'valid_id',
        accountId: 'valid_account_id',
        challengeId: 'valid_challenge_id',
        status: 'completed',
        score: 900,
        updatedAt: new Date(now.setDate(now.getDate() - 7))
      })
      const sut = makeSut()
      const dateToSearch = new Date(now.setDate(now.getDate() + 10))
      const result = await sut.findByDate(dateToSearch)
      expect(result).toBeDefined()
      expect(result.length).toBe(0)
    })

    test('Should return all test result from accountId', async () => {
      const now = new Date()
      await testResultCollection.insertOne({
        id: 'valid_id',
        accountId: 'valid_account_id',
        challengeId: 'valid_challenge_id',
        status: 'completed',
        score: 900,
        updatedAt: now
      })
      const sut = makeSut()
      const result = await sut.findByAccountId('valid_account_id')
      expect(result).toBeDefined()
      expect(result[0].accountId).toBe('valid_account_id')
      expect(result[0].challengeId).toBe('valid_challenge_id')
      expect(result[0].status).toBe('completed')
      expect(result[0].score).toBe(900)
    })
  })

  describe('UpdateTestResultRepository implementation', () => {
    test('Should return an test result updated', async () => {
      await testResultCollection.insertOne({
        id: 'valid_id',
        accountId: 'valid_account_id',
        challengeId: 'valid_challenge_id',
        status: 'started',
        score: 900
      })
      const sut = makeSut()
      const result = await sut.update('valid_account_id', 'valid_challenge_id', { score: 1000, status: 'completed' })
      expect(result).toBeDefined()
      expect(result.score).toBe(1000)
      expect(result.status).toBe('completed')
    })
  })
})
