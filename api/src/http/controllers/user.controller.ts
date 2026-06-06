import { Controller, Patch, Body, UseGuards, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UserService } from '@/services/user.service';
import { type JwtPayload } from '@/types/user.type';
import { BaseController } from './base.controller';
import {
  UpdateProfileDto,
  UpdateProfileResponseDto,
  BadRequestResponseDto,
  UnauthorizedResponseDto,
  ConflictResponseDto,
} from '../dtos';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userService: UserService) {
    super();
  }

  @Patch('me')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Atualiza o perfil do usuário logado (PATCH)',
    description:
      'Permite atualizar parcialmente nome, e-mail e/ou senha. Todos os campos são opcionais.',
  })
  @ApiOkResponse({
    description: 'Perfil atualizado com sucesso.',
    type: UpdateProfileResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos (e-mail mal formatado, senha curta, etc.).',
    type: BadRequestResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Token JWT ausente ou inválido.',
    type: UnauthorizedResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Usuário não encontrado.',
  })
  @ApiConflictResponse({
    description: 'O novo e-mail já está em uso por outra conta.',
    type: ConflictResponseDto,
  })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateProfileDto,
  ) {
    const updated = await this.userService.updateProfile(
      Number(user.sub),
      body,
    );
    return this.success(updated, 'Perfil atualizado com sucesso');
  }
}
