import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'

export class LogMongoRepositoiry implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
