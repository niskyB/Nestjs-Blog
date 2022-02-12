// module
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';

// service
import { AppService } from './app.service';

// config & dbconfig
import { TypeOrmModule } from '@nestjs/typeorm';

// entities
import { User } from './users/entities/user.entity';
import { Blog } from './blog/entities/blog.entity';

const DBConfig = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Blog],
});

console.log(process.env.DB_PORT);
console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);

@Module({
  imports: [
    // -- configs
    DBConfig,
    ScheduleModule.forRoot(),

    // -- modules
    UsersModule,
    AuthModule,
    BlogModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
