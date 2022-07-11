import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

let challengeCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const accessToken = sign({ id: 'any_id' }, env.jwtSecret)
  return accessToken
}

describe('Challenge Routes', () => {
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

  test('Should return 200 on search all challenges', async () => {
    const accessToken = await mockAccessToken()
    await challengeCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/challenges')
      .set('x-access-token', accessToken)
      .send({})
      .expect(200)
  })

  test('Should return 200 on search challenges by Id', async () => {
    const accessToken = await mockAccessToken()
    await challengeCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/challenges')
      .set('x-access-token', accessToken)
      .send({
        categoryId: 'valid_category_id'
      })
      .expect(200)
  })

  test('Should return 200 on start challenge', async () => {
    const accessToken = await mockAccessToken()
    const { insertedId } = await challengeCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/challenge/start')
      .set('x-access-token', accessToken)
      .send({
        challengeId: insertedId
      })
      .expect(200)
  })

  test('Should return 403 if authenticaion fails in /challenges route', async () => {
    await challengeCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/challenges')
      .send({
        categoryId: 'valid_category_id'
      })
      .expect(403)
  })

  test('Should return 403 if authenticaion fails in /challenge/start route', async () => {
    await challengeCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/challenges')
      .send({
        categoryId: 'valid_category_id'
      })
      .expect(403)
  })
})
