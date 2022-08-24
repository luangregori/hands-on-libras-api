import { FindAllCategoriesRepository } from '@/data/protocols'
import { CategoryModel } from '@/domain/models'
import { MongoHelper } from '@/infra/db'

export class CategoryMongoRepository implements FindAllCategoriesRepository {
  async findAll (): Promise<CategoryModel[]> {
    const categoryCollection = await MongoHelper.getCollection('categories')
    const result = await categoryCollection.find({}).toArray()
    return result.length ? result.map(category => MongoHelper.map(category)) : result
  }
}
