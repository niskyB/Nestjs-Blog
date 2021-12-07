// module
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';

// service
import { AppService } from './app.service';

// config & dbconfig
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// entities
import { User } from './users/entities/user.entity';
import { Blog } from './blog/entities/blog.entity';

const Config = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `./config/.env.` + process.env.NODE_ENV,
});

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

@Module({
  imports: [
    // -- configs
    Config,
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
