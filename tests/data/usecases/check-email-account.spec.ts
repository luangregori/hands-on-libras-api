import { AccountModel } from '@/domain/models'
import { CheckEmailAccount } from '@/domain/usecases'
import { DbCheckEmailAccount } from '@/data/usecases'
import { FindAccountRepository } from '@/data/protocols'

const makeFindAccountRepository = (): FindAccountRepository => {
  class FindAccountRepositoryStub implements FindAccountRepository {
    async findByEmail (email: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }

    async findById (accountId: string): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new FindAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

interface SutTypes {
  sut: CheckEmailAccount
  findAccountRepositoryStub: FindAccountRepository
}

const makeSut = (): SutTypes => {
  const findAccountRepositoryStub = makeFindAccountRepository()
  const sut = new DbCheckEmailAccount(findAccountRepositoryStub)
  return {
    sut,
    findAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call FindAccountRepository with correct values', async () => {
    const { sut, findAccountRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAccountRepositoryStub, 'findByEmail')
    await sut.check('valid_email')
    expect(findSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if FindAccountRepository throws', async () => {
    const { sut, findAccountRepositoryStub } = makeSut()
    jest.spyOn(findAccountRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.check('valid_email')
    await expect(promise).rejects.toThrow()
  })

  test('Should return true if email already registered', async () => {
    const { sut } = makeSut()
    const account = await sut.check('valid_email')
    expect(account).toBeTruthy()
  })
})
