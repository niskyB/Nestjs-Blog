import { Blog } from 'src/blog/entities/blog.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enum/user.userRole.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ default: 'image' })
  avatarUrl: string;

  @Column({ default: new Date().toISOString().slice(0, 19).replace('T', ' ') })
  createDate: Date;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ default: UserRole.USER.toString() })
  role: UserRole;

  @OneToMany(() => Blog, (blogs) => blogs.user)
  blogs: Blog[];
}
