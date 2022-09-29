import { AuthUser } from '@/data/usecases'
import { EncrypterSpy } from '@/tests/data/mocks'
import { throwError } from '@/tests/domain/mocks'
interface SutTypes {
  sut: AuthUser
  encrypterSpy: EncrypterSpy
}

const makeSut = (): SutTypes => {
  const encrypterSpy = new EncrypterSpy()
  const sut = new AuthUser(encrypterSpy)
  return {
    sut,
    encrypterSpy
  }
}

describe('AuthUser UseCase', () => {
  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterSpy } = makeSut()
    const verifySpy = jest.spyOn(encrypterSpy, 'verify')
    await sut.auth('any_token')
    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()
    jest.spyOn(encrypterSpy, 'verify').mockImplementationOnce(throwError)
    const account = await sut.auth('any_token')
    expect(account).toBeNull()
  })

  test('Should return payload if verify pass', async () => {
    const { sut, encrypterSpy } = makeSut()
    const payload = await sut.auth('any_token')
    expect(payload).toBe(encrypterSpy.decryptedPayload)
  })
})
