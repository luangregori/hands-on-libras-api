import nodemailer from 'nodemailer'
import { RemoteSendEmail } from '@/data/protocols'

export class NodeMailerAdapter implements RemoteSendEmail {
  constructor (
    private readonly host: string,
    private readonly port: number,
    private readonly user: string,
    private readonly pass: string
  ) { }

  async send (params: RemoteSendEmail.Params): Promise<void> {
    const { to, from, subject, text, html } = params

    const transport = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: {
        user: this.user,
        pass: this.pass
      }
    })

    await transport.sendMail({ to, from, subject, text, html })
  }
}
