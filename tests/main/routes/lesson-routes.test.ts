import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import app from '@/main/config/app'
import { MongoHelper } from '@/infra/db'

let lessonCollection: Collection

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
    lessonCollection = await MongoHelper.getCollection('lessons')
    await lessonCollection.deleteMany({})
  })

  test('Should return 200 on search all lessons', async () => {
    const accessToken = await mockAccessToken()
    await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/lessons')
      .set('x-access-token', accessToken)
      .send({})
      .expect(200)
  })

  test('Should return 200 on search lessons by Id', async () => {
    const accessToken = await mockAccessToken()
    await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/lessons')
      .set('x-access-token', accessToken)
      .send({
        categoryId: 'valid_category_id'
      })
      .expect(200)
  })

  test('Should return 200 on start lesson', async () => {
    const accessToken = await mockAccessToken()
    const { insertedId } = await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/lesson/start')
      .set('x-access-token', accessToken)
      .send({
        lessonId: insertedId
      })
      .expect(200)
  })

  test('Should return 403 if authentication fails in /lessons route', async () => {
    await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/lessons')
      .send({
        categoryId: 'valid_category_id'
      })
      .expect(403)
  })

  test('Should return 403 if authentication fails in /lesson/start route', async () => {
    await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    await request(app)
      .post('/api/lesson/start')
      .send({
        categoryId: 'valid_category_id'
      })
      .expect(403)
  })

  test('Should return 400 if no challengeId is provided in /lesson/start route', async () => {
    const accessToken = await mockAccessToken()

    await request(app)
      .post('/api/lesson/start')
      .set('x-access-token', accessToken)
      .send()
      .expect(400)
  })
})
