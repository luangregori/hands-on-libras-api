import faker from 'faker'
import { SignUpController } from '@/presentation/controllers'
import { MissingParamError, InvalidParamError, ServerError, EmailAlreadyRegisteredError } from '@/presentation/errors'
import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http-helper'
import { AddAccountSpy, CheckEmailAccountSpy, AuthenticationSpy, EmailValidatorSpy } from '@/tests/presentation/mocks'
import { throwError } from '@/tests/domain/mocks'

interface SutTypes {
  sut: SignUpController
  emailValidatorSpy: EmailValidatorSpy
  addAccountSpy: AddAccountSpy
  checkEmailAccountSpy: CheckEmailAccountSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const addAccountSpy = new AddAccountSpy()
  const checkEmailAccountSpy = new CheckEmailAccountSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignUpController(emailValidatorSpy, addAccountSpy, checkEmailAccountSpy, authenticationSpy)
  return {
    sut,
    emailValidatorSpy,
    addAccountSpy,
    checkEmailAccountSpy,
    authenticationSpy
  }
}

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const request = {
      name: null,
      email: faker.internet.email(),
      password,
      passwordConfirmation: password
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const password = faker.internet.password()
    const request = {
      name: faker.name.findName(),
      email: null,
      password,
      passwordConfirmation: password
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: null,
      passwordConfirmation: faker.internet.password()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const request = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      passwordConfirmation: null
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Should return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const request = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      passwordConfirmation: faker.internet.password()
    }
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorSpy, 'isValid')
    const request = mockRequest()
    await sut.handle(request)
    expect(isValidSpy).toHaveBeenCalledWith(request.email)
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()
    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()
    const addSpy = jest.spyOn(addAccountSpy, 'add')
    const request = mockRequest()
    await sut.handle(request)
    expect(addSpy).toHaveBeenCalledWith({
      name: request.name,
      email: request.email,
      password: request.password
    })
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const authSpy = jest.spyOn(authenticationSpy, 'auth')
    const request = mockRequest()
    await sut.handle(request)
    expect(authSpy).toHaveBeenCalledWith({
      email: request.email,
      password: request.password
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 403 if email is already registered', async () => {
    const { sut, checkEmailAccountSpy } = makeSut()
    jest.spyOn(checkEmailAccountSpy, 'check').mockReturnValueOnce(Promise.resolve(true))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailAlreadyRegisteredError()))
  })

  test('Should call CheckEmailAccount with correct value', async () => {
    const { sut, checkEmailAccountSpy } = makeSut()
    const checkSpy = jest.spyOn(checkEmailAccountSpy, 'check')
    const request = mockRequest()
    await sut.handle(request)
    expect(checkSpy).toHaveBeenCalledWith(request.email)
  })

  test('Should return 500 if CheckEmailAccount throws', async () => {
    const { sut, checkEmailAccountSpy } = makeSut()
    jest.spyOn(checkEmailAccountSpy, 'check').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })
})
