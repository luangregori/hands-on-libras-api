import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { TestResultMongoRepository } from './test-result'

let testResulCollection: Collection

describe('Test Result Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    testResulCollection = await MongoHelper.getCollection('test-results')
    await testResulCollection.deleteMany({})
  })

  const makeSut = (): TestResultMongoRepository => {
    return new TestResultMongoRepository()
  }

  test('Should return an test result', async () => {
    await testResulCollection.insertOne({
      id: 'valid_id',
      accountId: 'valid_account_id',
      challengeId: 'valid_challenge_id',
      completed: true,
      score: '900'
    })
    const sut = makeSut()
    const result = await sut.load('valid_account_id', 'valid_challenge_id')
    expect(result).toBeDefined()
    expect(result.accountId).toBe('valid_account_id')
    expect(result.challengeId).toBe('valid_challenge_id')
    expect(result.completed).toBeTruthy()
    expect(result.score).toBe('900')
  })

  test('Should return null on load', async () => {
    const sut = makeSut()
    const results = await sut.load('any_id', 'any_id')
    expect(results).toBeUndefined()
  })
})
