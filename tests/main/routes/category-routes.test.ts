import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'

let categoryCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const accessToken = sign({ id: 'any_id' }, env.jwtSecret)
  return accessToken
}

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
    const accessToken = await mockAccessToken()
    await categoryCollection.insertOne({
      id: 'any_id',
      name: faker.name.findName()
    })
    await request(app)
      .get('/api/categories')
      .set('x-access-token', accessToken)
      .send({
        id: 'any_id',
        name: faker.name.findName()
      })
      .expect(200)
  })

  test('Should return 403 if authentication fails', async () => {
    await categoryCollection.insertOne({
      id: 'any_id',
      name: faker.name.findName()
    })
    await request(app)
      .get('/api/categories')
      .send({
        id: 'any_id',
        name: faker.name.findName()
      })
      .expect(403)
  })
})
