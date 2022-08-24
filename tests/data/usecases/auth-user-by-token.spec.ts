import { AuthUser } from '@/data/usecases'
import { Encrypter } from '@/data/protocols'

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: any): Promise<string> {
      return await Promise.resolve('any_token')
    }

    async verify (token: string): Promise<Encrypter.Payload> {
      return await Promise.resolve({ id: 'any_id', email: 'any_mail', iat: 0, exp: 0 })
    }
  }
  return new EncrypterStub()
}

interface SutTypes{
  sut: AuthUser
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new AuthUser(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('AuthUser Usecase', () => {
  test('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const verifySpy = jest.spyOn(encrypterStub, 'verify')
    await sut.auth('any_token')
    expect(verifySpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'verify').mockReturnValueOnce(Promise.reject(new Error()))
    const account = await sut.auth('any_token')
    expect(account).toBeNull()
  })

  test('Should return payload if verify pass', async () => {
    const { sut } = makeSut()
    const payload = await sut.auth('any_token')
    expect(payload.id).toBe('any_id')
  })
})
