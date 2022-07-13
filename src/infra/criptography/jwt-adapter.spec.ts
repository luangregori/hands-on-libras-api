import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('token')
  },
  async verify (): Promise<any> {
    return await Promise.resolve({ id: 'any_id' })
  }
}))

const secret = 'any_secret'
const expiresIn = 3600
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(secret)
}

describe('Jwt Adapter Encrypt', () => {
  test('Should call jsonwebtoken with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any_value', expiresIn)
    expect(signSpy).toHaveBeenCalledWith('any_value', secret, { expiresIn })
  })

  test('Should return a token on success', async () => {
    const sut = makeSut()
    const token = await sut.encrypt('any_value', expiresIn)
    expect(token).toBe('token')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const promise = sut.encrypt('any_value', expiresIn)
    await expect(promise).rejects.toThrow()
  })
})

describe('Jwt Adapter Verify', () => {
  test('Should call jsonwebtoken with correct values', async () => {
    const sut = makeSut()
    const verifySpy = jest.spyOn(jwt, 'verify')
    await sut.verify('any_value')
    expect(verifySpy).toHaveBeenCalledWith('any_value', secret)
  })

  test('Should return a payload on success', async () => {
    const sut = makeSut()
    const payload = await sut.verify('any_value')
    expect(payload.id).toBe('any_id')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const promise = sut.verify('any_value')
    await expect(promise).rejects.toThrow()
  })
})
