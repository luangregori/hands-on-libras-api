import { SendEmailVerification } from '@/domain/usecases'
import { RemoteSendEmail, FindAccountRepository } from '@/data/protocols'

export class DbSendEmail implements SendEmailVerification {
  constructor (
    private readonly remoteSendEmail: RemoteSendEmail,
    private readonly findAccountRepository: FindAccountRepository
  ) { }

  async sendEmailVerification (email: string): Promise<void> {
    const account = await this.findAccountRepository.findByEmail(email)
    const link = `https://hands-on-libras-api.herokuapp.com/api/verify-account/${account.id}`

    const params = {
      to: email,
      from: '"Hands On Libras" <noreply@handsonlibras.com.br>',
      subject: 'Verificação de Email',
      text: `Olá! Clique no link abaixo para verificar seu e-mail no Hands On Libras \n ${link}`,
      html: `<h1>Olá!</h1> Clique no link abaixo para verificar seu e-mail no Hands On Libras \n <a href="${link}"> ${link} </a>`
    }

    await this.remoteSendEmail.send(params).catch(err => { console.log({ err }) })
  }
}
