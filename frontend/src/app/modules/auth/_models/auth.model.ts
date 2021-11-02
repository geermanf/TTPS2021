export class AuthModel {
  access_token: string;


  setAuth(auth: any) {
    this.access_token = auth.access_token;
  }
}
