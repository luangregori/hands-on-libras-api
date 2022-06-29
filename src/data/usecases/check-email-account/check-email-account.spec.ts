import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'
import { DbCheckEmailAccount } from './check-email-account'
import { CheckEmailAccount, FindAccountByEmailRepository } from './check-email-account-protocols'

const makeFindAccountByEmailRepository = (): FindAccountByEmailRepository => {
  class FindAccountByEmailRepositoryStub implements FindAccountByEmailRepository {
    async find (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new FindAccountByEmailRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

interface SutTypes {
  sut: CheckEmailAccount
  findAccountByEmailRepositoryStub: FindAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const findAccountByEmailRepositoryStub = makeFindAccountByEmailRepository()
  const sut = new DbCheckEmailAccount(findAccountByEmailRepositoryStub)
  return {
    sut,
    findAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call FindAccountByEmailRepository with correct values', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAccountByEmailRepositoryStub, 'find')
    await sut.check('valid_email')
    expect(findSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if FindAccountByEmailRepository throws', async () => {
    const { sut, findAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(findAccountByEmailRepositoryStub, 'find').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.check('valid_email')
    await expect(promise).rejects.toThrow()
  })

  test('Should return true if email already registered', async () => {
    const { sut } = makeSut()
    const account = await sut.check('valid_email')
    expect(account).toBeTruthy()
  })
})
