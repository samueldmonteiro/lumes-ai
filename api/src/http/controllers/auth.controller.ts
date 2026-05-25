import { Controller, Post, Body, Get, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '@/services/auth.service';
import { BaseController } from './base.controller';
import { RegisterDto, LoginDto } from '../dtos';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return this.created(user, 'Usuário registrado com sucesso');
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Autentica um usuário e gera o token JWT' })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);
    return this.success(result, 'Autenticação realizada com sucesso');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o perfil do usuário logado' })
  me(@CurrentUser() user: any) {
    return this.success(user, 'Perfil do usuário recuperado com sucesso');
  }
}
