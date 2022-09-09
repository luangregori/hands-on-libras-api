import { AccountModel } from '@/domain/models'
import { DbAuthentication } from '@/data/usecases'
import { FindAccountRepository, HashComparer, Encrypter } from '@/data/protocols'
import env from '@/main/config/env'

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

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: any): Promise<string> {
      return await Promise.resolve('any_token')
    }

    async verify (token: string): Promise<Encrypter.Payload> {
      return await Promise.resolve(null)
    }
  }
  return new EncrypterStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

interface SutTypes {
  sut: DbAuthentication
  findAccountRepositoryStub: FindAccountRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const findAccountRepositoryStub = makeFindAccountRepository()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const sut = new DbAuthentication(findAccountRepositoryStub, hashComparerStub, encrypterStub)
  return {
    sut,
    findAccountRepositoryStub,
    hashComparerStub,
    encrypterStub
  }
}

describe('DbAuthentication Usecase', () => {
  test('Should call FindAccountRepository with correct values', async () => {
    const { sut, findAccountRepositoryStub } = makeSut()
    const findSpy = jest.spyOn(findAccountRepositoryStub, 'findByEmail')
    await sut.auth(makeFakeAccount())
    expect(findSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if FindAccountRepository throws', async () => {
    const { sut, findAccountRepositoryStub } = makeSut()
    jest.spyOn(findAccountRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAccount())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if email not exists in database', async () => {
    const { sut, findAccountRepositoryStub } = makeSut()
    jest.spyOn(findAccountRepositoryStub, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    const authenticationModel = await sut.auth(makeFakeAccount())
    expect(authenticationModel).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAccount())
    expect(compareSpy).toHaveBeenCalledWith('hashed_password', 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAccount())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if hash compare return false ', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(null))
    const authenticationModel = await sut.auth(makeFakeAccount())
    expect(authenticationModel).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAccount())
    expect(encryptSpy).toHaveBeenCalledWith({ id: 'valid_id', email: 'valid_email' }, env.jwtExpiresIn)
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAccount())
    await expect(promise).rejects.toThrow()
  })

  test('Should return accessToken and name if authentication pass', async () => {
    const { sut } = makeSut()
    const authenticationModel = await sut.auth(makeFakeAccount())
    expect(authenticationModel.accessToken).toBe('any_token')
    expect(authenticationModel.name).toBe('valid_name')
  })
})
