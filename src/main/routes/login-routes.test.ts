import { hash } from 'bcrypt'
import request from 'supertest'
import { Collection } from 'mongodb'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return 200 on login', async () => {
    const password = await hash('123', 12)
    await accountCollection.insertOne({
      name: 'Luan',
      email: 'luanguerra36@hotmail.com',
      password
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'luanguerra36@hotmail.com',
        password: '123'
      })
      .expect(200)
  })
})
