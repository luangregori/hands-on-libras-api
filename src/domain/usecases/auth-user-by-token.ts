export interface AuthUserByToken{
  auth: (accesToken: string) => Promise<AuthUserByToken.Result>
}

export namespace AuthUserByToken{
  export interface Result {
    id: string
  }
}
