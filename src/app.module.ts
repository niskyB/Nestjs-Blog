// module
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

// service
import { AppService } from './app.service';

// config & dbconfig
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// entities
import { User } from './users/entities/user.entity';
import { ScheduleModule } from '@nestjs/schedule';

const Config = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `./config/.env.development`,
});

const DBConfig = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User],
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
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
