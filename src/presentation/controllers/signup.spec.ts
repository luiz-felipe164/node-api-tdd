import { AccountModel } from '../../domain/model/account'
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from '../errors'
import { ServerError } from '../errors/server-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }

      return await new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAccountStub()
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('SignUp Controller', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'teste_email@gmail.com',
        password: '3y7xJ$J#',
        passwordConfirmation: '3y7xJ$J#'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'teste_name',
        password: '3y7xJ$J#',
        passwordConfirmation: '3y7xJ$J#'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'any_email@any.com',
        passwordConfirmation: '3y7xJ$J#'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'any_email@any.com',
        password: 'any_pass'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('should return 400 if no passwordConfirmation is different of password', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'any_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'invalid_pass'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('should return 400 an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'invalid_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('emailValidator receives email from requets', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const jestSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'any_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    await sut.handle(httpRequest)
    expect(jestSpy).toHaveBeenCalledWith('any_email@any.com')
  })

  test('should returns serverError if an error in emailValidator', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'any_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('should returns serverError if an error in addAccount', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })

    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'any_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call addAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'any_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'teste_name',
      email: 'any_email@any.com',
      password: 'any_pass'
    })
  })

  test('should return 200 if correct data is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'teste_name',
        email: 'valid_email@any.com',
        password: 'any_pass',
        passwordConfirmation: 'any_pass'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})
