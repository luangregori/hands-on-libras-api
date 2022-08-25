import { Collection } from 'mongodb'
import { MongoHelper, LearningInfoMongoRepository } from '@/infra/db'

let learningInfoCollection: Collection

describe('Learning Info Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    learningInfoCollection = await MongoHelper.getCollection('learning-infos')
    await learningInfoCollection.deleteMany({})
  })

  const makeSut = (): LearningInfoMongoRepository => {
    return new LearningInfoMongoRepository()
  }

  test('Should return learning Infos', async () => {
    await learningInfoCollection.insertOne({
      id: 'valid_id',
      description: 'valid_description',
      challengeId: 'any_challenge_id',
      word: 'valid_word'
    })
    const sut = makeSut()
    const result = await sut.findByChallengeId('any_challenge_id')
    expect(result).toBeDefined()
    expect(result.length).toBe(1)
    expect(result[0].id).toBeDefined()
    expect(result[0].description).toBe('valid_description')
    expect(result[0].word).toBe('valid_word')
    expect(result[0].challengeId).toBe('any_challenge_id')
  })

  test('Should return null array', async () => {
    const sut = makeSut()
    const result = await sut.findByChallengeId('any_challenge_id')
    expect(result.length).toBe(0)
  })
})
