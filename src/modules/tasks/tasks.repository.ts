import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Like, Repository } from 'typeorm';
import { TaskEntity } from './classes/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';

@EntityRepository(TaskEntity)
export class TasksRepository extends Repository<TaskEntity> {
  async getAllTasks(
    filter: GetTasksFilterDto,
    userID: string,
  ): Promise<TaskEntity[]> {
    const { status, search } = filter;

    const query = this.createQueryBuilder('tasks')
      .where({ user_id: userID })
      .select(['tasks.id', 'tasks.title', 'tasks.description', 'tasks.status']);

    if (!Object.keys(filter).length) {
      return await query.getMany().catch(error => {
        throw new InternalServerErrorException(error.message);
      });
    }

    if (status) {
      query.andWhere({ status });
    }

    if (search) {
      query.andWhere([
        { title: Like(`%${search}%`) },
        { description: Like(`%${search}%`) },
      ]);
    }

    return await query.getMany().catch(error => {
      throw new InternalServerErrorException(error.message);
    });
  }

  async createTask(body: CreateTaskDto, userID: string): Promise<void> {
    const { title, description } = body;

    const task: TaskEntity = this.create({
      title,
      description,
      user_id: userID,
    });

    await this.save(task).catch(error => {
      throw new InternalServerErrorException(error.message);
    });
  }
}
