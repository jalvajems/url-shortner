import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/implementation/auth.controller';
import { User, UserSchema } from '../models/user.schema';
import { UserRepository } from '../repositories/implementation/user.repository';
import { IUSER_REPOSITORY } from '../repositories/interface/user.repository.interface';
import { AuthService } from '../services/implementation/auth.service';
import { PasswordService } from '../services/implementation/password.service';
import { TokenService } from '../services/implementation/token.service';
import { IAUTH_SERVICE } from '../services/interface/auth.service.interface';
import { IPASSWORD_SERVICE } from '../services/interface/password.service.interface';
import { ITOKEN_SERVICE } from '../services/interface/token.service.interface';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    {
      provide: IUSER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: IPASSWORD_SERVICE,
      useClass: PasswordService,
    },
    {
      provide: ITOKEN_SERVICE,
      useClass: TokenService,
    },
    {
      provide: IAUTH_SERVICE,
      useClass: AuthService,
    },
  ],
  exports: [IUSER_REPOSITORY, ITOKEN_SERVICE, JwtStrategy, PassportModule],
})
export class AuthModule {}
