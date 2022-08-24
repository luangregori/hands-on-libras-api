import { LogErrorRepository } from '@/data/protocols'
import { MongoHelper } from '@/infra/db'

export class LogMongoRepositoiry implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
