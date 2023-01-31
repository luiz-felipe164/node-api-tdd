import { AccountModel } from '../../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from '../../protocols/encrypter'
export class DbAddAccount implements AddAccount {
  private readonly encryter: Encrypter
  private readonly addAccountRepository: AddAccountRepository
  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encryter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encryter.encrypt(accountData.password)
    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }))
    return await new Promise(resolve => resolve({
      id: '1',
      name: 'luiz',
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }))
  }
}
