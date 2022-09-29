import { Collection } from 'mongodb'
import { MongoHelper, LessonMongoRepository } from '@/infra/db'

let lessonCollection: Collection

describe('Lesson Mongo Repository', () => {
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

  const makeSut = (): LessonMongoRepository => {
    return new LessonMongoRepository()
  }

  test('Should return all lessons', async () => {
    await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    const sut = makeSut()
    const lessons = await sut.findAll()
    expect(lessons).toBeDefined()
    expect(lessons.length).toBe(1)
    expect(lessons[0].id).toBeDefined()
    expect(lessons[0].name).toBe('valid_name')
    expect(lessons[0].description).toBe('valid_description')
    expect(lessons[0].image_url).toBe('valid_image_url')
    expect(lessons[0].categoryId).toBe('valid_category_id')
  })

  test('Should return null array on findAll', async () => {
    const sut = makeSut()
    const lessons = await sut.findAll()
    expect(lessons.length).toBe(0)
  })

  test('Should return lesson by Category Id', async () => {
    await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    const sut = makeSut()
    const lessons = await sut.findByCategoryId('valid_category_id')
    expect(lessons).toBeDefined()
    expect(lessons.length).toBe(1)
    expect(lessons[0].id).toBeDefined()
    expect(lessons[0].name).toBe('valid_name')
    expect(lessons[0].description).toBe('valid_description')
    expect(lessons[0].image_url).toBe('valid_image_url')
    expect(lessons[0].categoryId).toBe('valid_category_id')
  })

  test('Should return null array if invalid categoryId provided', async () => {
    await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    const sut = makeSut()
    const lessons = await sut.findByCategoryId('invalid_id')
    expect(lessons.length).toBe(0)
  })

  test('Should return lesson by Id', async () => {
    const { insertedId } = await lessonCollection.insertOne({
      id: 'valid_id',
      name: 'valid_name',
      description: 'valid_description',
      image_url: 'valid_image_url',
      categoryId: 'valid_category_id'
    })
    const sut = makeSut()
    const lessons = await sut.findById(insertedId)
    expect(lessons).toBeDefined()
    expect(lessons.id).toBeDefined()
    expect(lessons.name).toBe('valid_name')
    expect(lessons.description).toBe('valid_description')
    expect(lessons.image_url).toBe('valid_image_url')
    expect(lessons.categoryId).toBe('valid_category_id')
  })
})
