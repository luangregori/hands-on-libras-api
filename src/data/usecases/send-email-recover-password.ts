import { RecoverPassword } from '@/domain/usecases'
import { RemoteSendEmail, Hasher, UpdateAccountRepository } from '@/data/protocols'

export class DbSendEmailRecover implements RecoverPassword {
  constructor (
    private readonly remoteSendEmail: RemoteSendEmail,
    private readonly hasher: Hasher,
    private readonly updateAccountRepository: UpdateAccountRepository
  ) { }

  async sendEmail (email: string): Promise<void> {
    const code = this.generateOTP()
    const hashedPassword = await this.hasher.hash(code)
    await this.updateAccountRepository.updatePasswordByEmail(email, hashedPassword)

    const params = {
      to: email,
      from: '"Hands On Libras" <noreply@handsonlibras.com.br>',
      subject: 'Recuperação de Email',
      text: `Olá! Digite o código a seguir no app para recuperar o acesso a sua conta: \n ${code}`,
      html: `<h1>Olá!</h1> Digite o código a seguir no app para recuperar o acesso a sua conta: \n ${code} `
    }

    await this.remoteSendEmail.send(params)
  }

  private generateOTP (): string {
    const digits = '0123456789'
    let OTP = ''
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)]
    }
    return OTP
  }
}
