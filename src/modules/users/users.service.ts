import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './classes/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async getUserById(userID: string): Promise<string> {
    const { id } = await this.usersRepository
      .findOneOrFail(userID, { select: ['id'] })
      .catch(() => {
        throw new UnauthorizedException(`User unauthorized`);
      });

    return id;
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    const user = await this.usersRepository
      .findOneOrFail({ where: { username } })
      .catch(() => {
        throw new UnauthorizedException(`Please check your login credentials`);
      });

    return user;
  }

  async createUser(body: CreateUserDto): Promise<void> {
    return this.usersRepository.createUser(body);
  }
}
