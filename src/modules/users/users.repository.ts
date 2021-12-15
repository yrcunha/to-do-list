import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './classes/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async createUser(body: CreateUserDto): Promise<void> {
    const { username, password } = body;

    const user = this.create({ username, password });

    await this.save(user).catch(error => {
      if (error.code == 23505) {
        throw new ConflictException(`Username already exists`);
      } else {
        throw new InternalServerErrorException(error.message);
      }
    });
  }
}
