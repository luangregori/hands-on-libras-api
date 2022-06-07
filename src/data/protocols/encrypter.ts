export interface Encrypter {
  encrypt: (payload: any) => Promise<string>
}
