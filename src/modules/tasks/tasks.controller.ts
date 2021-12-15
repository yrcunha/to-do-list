import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../labels/get-user.decorator';
import { TaskEntity } from './classes/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { GetTasksFilterDto } from './dtos/get-tasks-filter.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get(':id')
  getTaskById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() userID: string,
  ): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id, userID);
  }

  @Get()
  getAllTasks(
    @Query() filter: GetTasksFilterDto,
    @GetUser() userID: string,
  ): Promise<TaskEntity[]> {
    return this.tasksService.getAllTasks(filter, userID);
  }

  @Post()
  createTask(
    @Body() body: CreateTaskDto,
    @GetUser() userID: string,
  ): Promise<void> {
    return this.tasksService.createTask(body, userID);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTaskDto,
    @GetUser() userID: string,
  ): Promise<void> {
    return this.tasksService.updateTaskStatus(id, body, userID);
  }

  @Delete(':id')
  deleteTask(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() userID: string,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, userID);
  }
}
