import { CheckEmailAccount } from '@/domain/usecases'
import { DbCheckEmailAccount } from '@/data/usecases'
import { FindAccountRepositorySpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: CheckEmailAccount
  findAccountRepositorySpy: FindAccountRepositorySpy
}

const makeSut = (): SutTypes => {
  const findAccountRepositorySpy = new FindAccountRepositorySpy()
  const sut = new DbCheckEmailAccount(findAccountRepositorySpy)
  return {
    sut,
    findAccountRepositorySpy
  }
}

describe('DbAddAccount UseCase', () => {
  test('Should call FindAccountRepository with correct values', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findAccountRepositorySpy, 'findByEmail')
    await sut.check('valid_email')
    expect(findSpy).toHaveBeenCalledWith('valid_email')
  })

  test('Should throw if FindAccountRepository throws', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    jest.spyOn(findAccountRepositorySpy, 'findByEmail').mockImplementationOnce(throwError)
    const promise = sut.check('valid_email')
    await expect(promise).rejects.toThrow()
  })

  test('Should return true if email already registered', async () => {
    const { sut } = makeSut()
    const account = await sut.check('valid_email')
    expect(account).toBeTruthy()
  })
})
