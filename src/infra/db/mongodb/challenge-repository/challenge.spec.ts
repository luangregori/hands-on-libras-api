import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { ChallengeMongoRepository } from './challenge'

let challengeCollection: Collection

describe('Challenge Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    challengeCollection = await MongoHelper.getCollection('challenges')
    await challengeCollection.deleteMany({})
  })

  const makeSut = (): ChallengeMongoRepository => {
    return new ChallengeMongoRepository()
  }

  test('Should return all challenges', async () => {
    await challengeCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    const sut = makeSut()
    const challenges = await sut.findAll()
    expect(challenges).toBeDefined()
    expect(challenges.length).toBe(1)
    expect(challenges[0].id).toBeDefined()
    expect(challenges[0].name).toBe('valid_name')
    expect(challenges[0].description).toBe('valid_description')
    expect(challenges[0].image_url).toBe('valid_image_url')
    expect(challenges[0].categoryId).toBe('valid_category_id')
  })

  test('Should return null array on findAll', async () => {
    const sut = makeSut()
    const challenges = await sut.findAll()
    expect(challenges.length).toBe(0)
  })

  // test('Should return challenge by Id', async () => {
  //   await challengeCollection.insertOne({
  //     id: 'valid_id',
  //     name: 'valid_name',
  //     description: 'valid_description',
  //     image_url: 'valid_image_url',
  //     categoryId: 'valid_category_id'
  //   })
  //   const sut = makeSut()
  //   const challenges = await sut.findbyId('valid_id')
  //   expect(challenges).toBeDefined()
  //   expect(challenges.length).toBe(1)
  //   expect(challenges[0].id).toBeDefined()
  //   expect(challenges[0].name).toBe('valid_name')
  //   expect(challenges[0].description).toBe('valid_description')
  //   expect(challenges[0].image_url).toBe('valid_image_url')
  //   expect(challenges[0].categoryId).toBe('valid_category_id')
  // })

  test('Should return null array if invalid categoryId provided', async () => {
    await challengeCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    const sut = makeSut()
    const challenges = await sut.findbyId('invalid_id')
    expect(challenges.length).toBe(0)
  })
})
