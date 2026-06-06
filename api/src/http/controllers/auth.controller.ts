import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from '@/services/auth.service';
import { type JwtPayload } from '@/types/user.type';
import { BaseController } from './base.controller';
import {
  RegisterDto,
  LoginDto,
  RegisterResponseDto,
  LoginResponseDto,
  MeResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
} from '../dtos';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ConflictResponseDto } from '../dtos/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiCreatedResponse({
    description:
      'Usuário registrado com sucesso. Retorna os dados do usuário e o token JWT.',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Erros de validação nos dados enviados (e-mail inválido, senha muito curta, etc.).',
    type: BadRequestResponseDto,
  })
  @ApiConflictResponse({
    description: 'E-mail já cadastrado no sistema.',
    type: ConflictResponseDto,
  })
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);
    return this.created(user, 'Usuário registrado com sucesso');
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Autentica um usuário e gera o token JWT' })
  @ApiOkResponse({
    description:
      'Autenticação realizada com sucesso. Retorna o token JWT e os dados do usuário.',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Erros de validação nos dados enviados.',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'E-mail ou senha inválidos.',
    type: UnauthorizedResponseDto,
  })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);
    return this.success(result, 'Autenticação realizada com sucesso');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna o perfil do usuário logado' })
  @ApiOkResponse({
    description: 'Perfil do usuário recuperado com sucesso.',
    type: MeResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente ou inválido.',
    type: UnauthorizedResponseDto,
  })
  me(@CurrentUser() user: JwtPayload) {
    return this.success(user, 'Perfil do usuário recuperado com sucesso');
  }
}
