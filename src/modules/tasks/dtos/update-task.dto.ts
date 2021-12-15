import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '../classes/task-status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
