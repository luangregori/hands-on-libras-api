import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let categoryCollection: Collection

describe('Category Routes', () => {
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

  test('Should return 200 on search all categories', async () => {
    await categoryCollection.insertOne({
      id: 'any_id',
      name: 'any_name'
    })
    await request(app)
      .get('/api/categories')
      .send({
        id: 'any_id',
        name: 'any_name'
      })
      .expect(200)
  })
})
