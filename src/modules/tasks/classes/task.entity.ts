import { UserEntity } from 'src/modules/users/classes/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from './task-status.enum';

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_id: string;

  @Column('varchar', { name: 'title', length: 150 })
  title: string;

  @Column('text', { name: 'description' })
  description: string;

  @Column('enum', { enum: TaskStatus, default: TaskStatus.OPEN })
  status: TaskStatus;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
