import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { TaskEntity } from './classes/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,

    private usersService: UsersService, // @InjectRepository(UsersRepository) // private usersRepository: UsersRepository,
  ) {}

  async getTaskById(id: string, userID: string): Promise<TaskEntity> {
    const found = await this.tasksRepository
      .findOneOrFail(id, {
        where: { user_id: userID },
        select: ['id', 'title', 'description', 'status'],
      })
      .catch(() => {
        throw new NotFoundException(`Task with ID "${id}" not found`);
      });

    return found;
  }

  async getAllTasks(
    filter: GetTasksFilterDto,
    userID: string,
  ): Promise<TaskEntity[]> {
    return await this.tasksRepository.getAllTasks(filter, userID);
  }

  async createTask(body: CreateTaskDto, userID: string): Promise<void> {
    const user_id = await this.usersService.getUserById(userID);

    this.tasksRepository.createTask(body, user_id);
  }

  async updateTaskStatus(
    id: string,
    body: UpdateTaskDto,
    userID: string,
  ): Promise<void> {
    const { status } = body;

    const user_id = await this.usersService.getUserById(userID);

    const result = await this.tasksRepository
      .update({ id, user_id }, { status })
      .catch(error => {
        throw new InternalServerErrorException(error.message);
      });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async deleteTask(id: string, userID: string): Promise<void> {
    const user_id = await this.usersService.getUserById(userID);

    const result = await this.tasksRepository
      .delete({ id, user_id })
      .catch(error => {
        throw new InternalServerErrorException(error.message);
      });

    if (!result.affected) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }
}
