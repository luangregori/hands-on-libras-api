import { Collection } from 'mongodb'
import { MongoHelper, ChallengeQuestionMongoRepository } from '@/infra/db'
import { ChallengeQuestionModel } from '@/domain/models'

let challengeQuestionCollection: Collection

describe('Challenge Question Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    challengeQuestionCollection = await MongoHelper.getCollection('challenge-questions')
    await challengeQuestionCollection.deleteMany({})
  })

  const makeSut = (): ChallengeQuestionMongoRepository => {
    return new ChallengeQuestionMongoRepository()
  }

  const makeFakeChallengeQuestionModel = (): ChallengeQuestionModel => ({
    id: 'any_id',
    word: 'any_word',
    options: ['any_option_1', 'any_option_2', 'any_option_3', 'any_option_4'],
    lessonId: 'any_lesson_id'
  })

  describe('ChallengeQuestionMongoRepository implementation', () => {
    test('Should return all test questions from lessonId', async () => {
      await challengeQuestionCollection.insertOne(makeFakeChallengeQuestionModel())
      const sut = makeSut()
      const result = await sut.findByLessonId('any_lesson_id')
      expect(result).toBeDefined()
      expect(result[0].id).toBeDefined()
      expect(result[0].lessonId).toBe(makeFakeChallengeQuestionModel().lessonId)
      expect(result[0].word).toBe(makeFakeChallengeQuestionModel().word)
      expect(result[0].options).toEqual(makeFakeChallengeQuestionModel().options)
    })
  })
})
