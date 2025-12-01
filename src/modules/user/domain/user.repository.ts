import { UserEntity } from './user.entity';

export interface UserRepository {
  create(props: {
    tenantId: string;
    name: string;
    email: string;
    passwordHash: string;
    birthDate: Date;
  }): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  save(user: UserEntity): Promise<void>;
}
