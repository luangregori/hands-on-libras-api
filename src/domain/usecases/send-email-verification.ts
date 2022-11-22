export interface SendEmailVerification {
  sendEmailVerification: (email: string) => Promise<void>
}
