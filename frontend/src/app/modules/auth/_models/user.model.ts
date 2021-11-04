import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  pic: string;
  roles: number[];


  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.first_name = user.first_name || '';
    this.last_name = user.last_name || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.roles = user.roles || [];
  }
}
