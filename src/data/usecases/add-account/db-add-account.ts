import { throws } from 'assert'
import { AccountModel } from '../../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encryter: Encrypter
  constructor (encrypter: Encrypter) {
    this.encryter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encryter.encrypt(account.password)
    return await new Promise(resolve => resolve({
      id: '1',
      name: 'luiz',
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }))
  }
}
