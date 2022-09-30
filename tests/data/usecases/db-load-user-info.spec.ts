import { DbLoadUserInfo } from '@/data/usecases'
import { FindAccountRepositorySpy } from '@/tests/data/mocks'
import { throwError, mockAccountId } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DbLoadUserInfo
  findAccountRepositorySpy: FindAccountRepositorySpy
}

const makeSut = (): SutTypes => {
  const findAccountRepositorySpy = new FindAccountRepositorySpy()
  const sut = new DbLoadUserInfo(
    findAccountRepositorySpy
  )
  return {
    sut,
    findAccountRepositorySpy
  }
}

describe('DbLoadUserInfo UseCase', () => {
  test('Should call FindAccountRepository with correct value', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findAccountRepositorySpy, 'findById')
    const accountId = mockAccountId()
    await sut.load(accountId)
    expect(findSpy).toHaveBeenCalledWith(accountId)
  })

  test('Should throw if FindAccountRepository throws', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    jest.spyOn(findAccountRepositorySpy, 'findById').mockImplementationOnce(throwError)
    const promise = sut.load(mockAccountId())
    await expect(promise).rejects.toThrow()
  })

  test('Should return the infos if valid data is provided', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    const accountId = mockAccountId()
    const result = await sut.load(accountId)
    expect(result.name).toBe(findAccountRepositorySpy.result.name)
    expect(result.image_url).toBe(findAccountRepositorySpy.result.image_url)
  })
})
