import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { CategoryMongoRepository } from './category'

let categoryCollection: Collection

describe('Category Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    categoryCollection = await MongoHelper.getCollection('categories')
    await categoryCollection.deleteMany({})
  })

  const makeSut = (): CategoryMongoRepository => {
    return new CategoryMongoRepository()
  }

  test('Should return all categories', async () => {
    await categoryCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name'
    })
    const sut = makeSut()
    const categories = await sut.findAll()
    expect(categories).toBeDefined()
    expect(categories.length).toBe(1)
    expect(categories[0].id).toBeDefined()
    expect(categories[0].name).toBe('valid_name')
  })

  test('Should return null array', async () => {
    const sut = makeSut()
    const categories = await sut.findAll()
    expect(categories.length).toBe(0)
  })
})
