import { ObjectId } from 'mongodb'
import { FindAllLessonsRepository, FindLessonsByCategoryIdRepository, FindLessonByIdRepository } from '@/data/protocols'
import { LessonModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'

export class LessonMongoRepository implements FindAllLessonsRepository, FindLessonsByCategoryIdRepository, FindLessonByIdRepository {
  async findAll (): Promise<LessonModel[]> {
    const challengeCollection = await MongoHelper.getCollection('lessons')
    const result = await challengeCollection.find({}).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }

  async findByCategoryId (categoryId: string): Promise<LessonModel[]> {
    const challengeCollection = await MongoHelper.getCollection('lessons')
    const result = await challengeCollection.find({ categoryId }).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }

  async findById (lessonId: string): Promise<LessonModel> {
    const challengeCollection = await MongoHelper.getCollection('lessons')
    const result = await challengeCollection.findOne({ _id: new ObjectId(lessonId) })
    if (result) return MongoHelper.map(result)
  }
}
