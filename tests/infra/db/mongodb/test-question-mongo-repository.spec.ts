import { Collection } from 'mongodb'
import { MongoHelper, TestQuestionMongoRepository } from '@/infra/db'
import { TestQuestionModel } from '@/domain/models'

let testQuestionCollection: Collection

describe('Test Question Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    testQuestionCollection = await MongoHelper.getCollection('test-questions')
    await testQuestionCollection.deleteMany({})
  })

  const makeSut = (): TestQuestionMongoRepository => {
    return new TestQuestionMongoRepository()
  }

  const makeFakeTestQuestionModel = (): TestQuestionModel => ({
    id: 'any_id',
    word: 'any_word',
    options: ['any_option_1', 'any_option_2', 'any_option_3', 'any_option_4'],
    challengeId: 'any_challenge_id'
  })

  describe('TestQuestionMongoRepository implementation', () => {
    test('Should return all test questions from challengeId', async () => {
      await testQuestionCollection.insertOne(makeFakeTestQuestionModel())
      const sut = makeSut()
      const result = await sut.findByChallengeId('any_challenge_id')
      expect(result).toBeDefined()
      expect(result[0].id).toBeDefined()
      expect(result[0].challengeId).toBe(makeFakeTestQuestionModel().challengeId)
      expect(result[0].word).toBe(makeFakeTestQuestionModel().word)
      expect(result[0].options).toEqual(makeFakeTestQuestionModel().options)
    })
  })
})
