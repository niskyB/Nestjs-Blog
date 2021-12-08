import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: false, unique: true, length: 750 })
  content: string;

  @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
  createDate: Date;

  @Column({ default: false })
  isDisabled: boolean;

  @ManyToOne(() => User, (user) => user.blogs, {
    nullable: false,
    cascade: true,
  })
  user: User;
}
