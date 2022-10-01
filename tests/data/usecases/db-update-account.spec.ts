import { DbUpdateAccount } from '@/data/usecases'
import { HashComparerSpy, FindAccountRepositorySpy, UpdateAccountRepositorySpy } from '@/tests/data/mocks'
import { mockAccountId, mockUpdateAccountParams, throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: DbUpdateAccount
  hasherCompareSpy: HashComparerSpy
  findAccountRepositorySpy: FindAccountRepositorySpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
}

const makeSut = (): SutTypes => {
  const hasherCompareSpy = new HashComparerSpy()
  const findAccountRepositorySpy = new FindAccountRepositorySpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const sut = new DbUpdateAccount(findAccountRepositorySpy, hasherCompareSpy, updateAccountRepositorySpy)
  return {
    sut,
    hasherCompareSpy,
    findAccountRepositorySpy,
    updateAccountRepositorySpy
  }
}

describe('DbUpdateAccount UseCase', () => {
  test('Should call HashComparer with correct values', async () => {
    const { sut, hasherCompareSpy, findAccountRepositorySpy } = makeSut()
    const compareSpy = jest.spyOn(hasherCompareSpy, 'compare')
    const updateAccountParams = mockUpdateAccountParams()
    await sut.updateById(mockAccountId(), updateAccountParams)
    expect(compareSpy).toHaveBeenCalledWith(updateAccountParams.oldPassword, findAccountRepositorySpy.result.password)
  })

  test('Should throw if oldPassword is wrong', async () => {
    const { sut, hasherCompareSpy } = makeSut()
    jest.spyOn(hasherCompareSpy, 'compare').mockResolvedValueOnce(false)
    const promise = sut.updateById(mockAccountId(), mockUpdateAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hasherCompareSpy } = makeSut()
    jest.spyOn(hasherCompareSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.updateById(mockAccountId(), mockUpdateAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call FindAccountRepository with correct value', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    const findSpy = jest.spyOn(findAccountRepositorySpy, 'findById')
    const accountId = mockAccountId()
    const updateAccountParams = mockUpdateAccountParams()
    await sut.updateById(accountId, updateAccountParams)
    expect(findSpy).toHaveBeenCalledWith(accountId)
  })

  test('Should throw if FindAccountRepository throws', async () => {
    const { sut, findAccountRepositorySpy } = makeSut()
    jest.spyOn(findAccountRepositorySpy, 'findById').mockImplementationOnce(throwError)
    const promise = sut.updateById(mockAccountId(), mockUpdateAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    const updateSpy = jest.spyOn(updateAccountRepositorySpy, 'updateById')
    const accountId = mockAccountId()
    const updateAccountParams = mockUpdateAccountParams()
    await sut.updateById(accountId, updateAccountParams)
    expect(updateSpy).toHaveBeenCalledWith(accountId, {
      name: updateAccountParams.name,
      email: updateAccountParams.email,
      password: updateAccountParams.newPassword,
      image_url: updateAccountParams.image_url
    })
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    jest.spyOn(updateAccountRepositorySpy, 'updateById').mockImplementationOnce(throwError)
    const promise = sut.updateById(mockAccountId(), mockUpdateAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should not return the password', async () => {
    const { sut } = makeSut()
    const account = await sut.updateById(mockAccountId(), mockUpdateAccountParams()) as any
    expect(account.password).toBeUndefined()
  })

  test('Should return an account on update successfully', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    const account = await sut.updateById(mockAccountId(), mockUpdateAccountParams())
    expect(account).toEqual(updateAccountRepositorySpy.result)
  })
})
