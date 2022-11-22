export interface RemoteSendEmail {
  send: (params: RemoteSendEmail.Params) => Promise<void>
}

export namespace RemoteSendEmail {
  export interface Params {
    to: string
    from: string
    subject: string
    text: string
    html: string
  }
}
