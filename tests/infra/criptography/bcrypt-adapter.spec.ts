import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/criptography'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hash')
  },

  async compare (): Promise<boolean> {
    return await Promise.resolve(true)
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter Hasher implementation', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return a hash on success', async () => {
    const sut = makeSut()
    const hash = await sut.hash('any_value')
    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const promise = sut.hash('any_value')
    await expect(promise).rejects.toThrow()
  })
})

describe('Bcrypt Adapter HashComparer implementation', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any_text', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any_text', 'any_hash')
  })

  test('Should return true on success', async () => {
    const sut = makeSut()
    const result = await sut.compare('any_text', 'any_hash')
    expect(result).toBeTruthy()
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
      return await Promise.reject(new Error())
    })
    const promise = sut.compare('any_text', 'any_hash')
    await expect(promise).rejects.toThrow()
  })
})
