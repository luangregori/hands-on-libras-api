import { Collection } from 'mongodb'
import { MongoHelper, AccountMongoRepository } from '@/infra/db'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add successfully', async () => {
    const sut = makeSut()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.password).toBe('any_password')
  })

  test('Should return an account on find by email successfully', async () => {
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_hash'
    })
    const sut = makeSut()
    const account = await sut.findByEmail('any_mail@mail.com')
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_mail@mail.com')
    expect(account.password).toBe('any_hash')
  })
  test('Should return an account on find by id successfully', async () => {
    const { insertedId } = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_hash'
    })
    const sut = makeSut()
    const account = await sut.findById(insertedId)
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_mail@mail.com')
    expect(account.password).toBe('any_hash')
  })
})
