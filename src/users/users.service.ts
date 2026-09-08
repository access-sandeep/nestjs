import { Injectable } from '@nestjs/common';

export type User = {
  id: number;
  username: string;
  password: string;
  roles: string[];
};

@Injectable()
export class UsersService {
  private readonly users: User[] = [
    { id: 1, username: 'admin', password: 'admin123', roles: ['admin', 'user'] },
    { id: 2, username: 'john', password: 'john123', roles: ['user'] },
  ];

  findByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }
}
