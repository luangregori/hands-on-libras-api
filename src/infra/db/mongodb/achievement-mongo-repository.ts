import { MongoHelper } from '@/infra/db'
import { FindAchievementsRepository, AddAchievementRepository } from '@/data/protocols'
import { AchievementModel } from '@/domain/models'

export class AchievementMongoRepository implements AddAchievementRepository, FindAchievementsRepository {
  async findOrCreate (accountId: string, achievementModel: AchievementModel): Promise<boolean> {
    const achievementsCollection = await MongoHelper.getCollection('achievements')
    let result = await achievementsCollection.findOne({ accountId, id: achievementModel.id })
    if (result) {
      return !!MongoHelper.map(result)
    }
    result = await achievementsCollection.insertOne(achievementModel)
    return !!MongoHelper.map(result.ops[0])
  }

  async find (accountId: string): Promise<AchievementModel[]> {
    const achievementsCollection = await MongoHelper.getCollection('achievements')
    const result = await achievementsCollection.find({ accountId }).toArray()
    return result.map(MongoHelper.map)
  }
}
