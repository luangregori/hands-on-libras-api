import { DbAuthentication } from '@/data/usecases'
import { FindAccountRepositorySpy, HashComparerSpy, EncrypterSpy } from '@/tests/data/mocks'
import { throwError, mockAuthenticationParams } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DbAuthentication
  findAccountRepositorySpy: FindAccountRepositorySpy
  hashComparerSpy: HashComparerSpy
  encrypterSpy: EncrypterSpy
}

const makeSut = (): SutTypes => {
  const findAccountRepositorySpy = new FindAccountRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const encrypterSpy = new EncrypterSpy()
  const sut = new DbAuthentication(
    findAccountRepositorySpy,
    hashComparerSpy,
    encrypterSpy
  )
  return {
    sut,
    findAccountRepositorySpy,
    hashComparerSpy,
    encrypterSpy
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call FindAccountRepository with correct values', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(findAccountRepositorySpy.email).toBe(authenticationParams.email)
  })

  test('Should throw if FindAccountRepository throws', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    jest.spyOn(findAccountRepositorySpy, 'findByEmail').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if email not exists in database', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    jest.spyOn(findAccountRepositorySpy, 'findByEmail').mockReturnValueOnce(Promise.resolve(null))
    const authenticationModel = await sut.auth(mockAuthenticationParams())
    expect(authenticationModel).toBeNull()
  })

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, findAccountRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(hashComparerSpy.plaintext).toBe(authenticationParams.password)
    expect(hashComparerSpy.digest).toBe(findAccountRepositorySpy.result.password)
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if hash compare return false ', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockReturnValueOnce(Promise.resolve(null))
    const authenticationModel = await sut.auth(mockAuthenticationParams())
    expect(authenticationModel).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, encrypterSpy, findAccountRepositorySpy } = makeSut()
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(encrypterSpy.payload).toEqual({
      id: findAccountRepositorySpy.result.id,
      email: findAccountRepositorySpy.result.email
    })
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return accessToken and name if authentication pass', async () => {
    const { sut, encrypterSpy, findAccountRepositorySpy } = makeSut()
    const authenticationModel = await sut.auth(mockAuthenticationParams())
    expect(authenticationModel.accessToken).toBe(encrypterSpy.ciphertext)
    expect(authenticationModel.name).toBe(findAccountRepositorySpy.result.name)
  })
})
