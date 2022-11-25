export interface RecoverPassword {
  sendEmail: (email?: string) => Promise<void>
}
