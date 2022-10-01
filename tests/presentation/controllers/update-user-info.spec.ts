import faker from 'faker'
import { UpdateUserInfoController } from '@/presentation/controllers'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { ok, serverError, badRequest } from '@/presentation/helpers/http-helper'
import { UpdateAccountSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

const mockRequest = (): UpdateUserInfoController.Request => ({
  accountId: faker.datatype.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
  image_url: faker.internet.url(),
  oldPassword: faker.internet.password(),
  newPassword: faker.internet.password()
})

interface SutTypes {
  sut: UpdateUserInfoController
  updateAccountSpy: UpdateAccountSpy
}

const makeSut = (): SutTypes => {
  const updateAccountSpy = new UpdateAccountSpy()
  const sut = new UpdateUserInfoController(updateAccountSpy)
  return {
    sut,
    updateAccountSpy
  }
}

describe('Update User Info Controller', () => {
  test('Should return 400 if newPassword is provided, but oldPassword not', async () => {
    const { sut } = makeSut()
    const request = {
      accountId: faker.datatype.uuid(),
      oldPassword: null,
      newPassword: faker.internet.password()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('oldPassword')))
  })

  test('Should return 500 if UpdateAccount throws', async () => {
    const { sut, updateAccountSpy } = makeSut()
    jest.spyOn(updateAccountSpy, 'updateById').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call UpdateAccount with correct values', async () => {
    const { sut, updateAccountSpy } = makeSut()
    const updateSpy = jest.spyOn(updateAccountSpy, 'updateById')
    const request = mockRequest()
    await sut.handle(request)
    expect(updateSpy).toHaveBeenCalledWith(
      request.accountId,
      {
        name: request.name,
        email: request.email,
        image_url: request.image_url,
        oldPassword: request.oldPassword,
        newPassword: request.newPassword
      })
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, updateAccountSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(updateAccountSpy.result))
  })
})
