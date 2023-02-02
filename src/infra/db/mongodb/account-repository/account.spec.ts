import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    const uri = process.env.MONGO_URL ?? 'mongodb://localhost:27017'
    await MongoHelper.connect(uri)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should return a account on success', async () => {
    const sut = new AccountMongoRepository()
    const account = await sut.add({
      name: 'any_email',
      email: 'any_email@example.com',
      password: 'any_password'
    })
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_email')
    expect(account.email).toBe('any_email@example.com')
    expect(account.password).toBe('any_password')
  })
})
