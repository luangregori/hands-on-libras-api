import { FindAllCategoriesRepository } from '@/data/protocols/find-all-categories-repository'
import { CategoryModel } from '@/domain/models/category'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class CategoryMongoRepository implements FindAllCategoriesRepository {
  async findAll (): Promise<CategoryModel[]> {
    const categoryCollection = await MongoHelper.getCollection('categories')
    const result = await categoryCollection.find({}).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }
}
