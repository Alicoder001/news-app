import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import { AuthService } from '../../application/services/auth.service';
import type { AuthUser } from '../../infrastructure/security/auth-user.interface';
import { JwtAuthGuard } from '../../infrastructure/security/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';

@ApiTags('admin-auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.username, dto.password);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin token refresh' })
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin logout' })
  logout(@Req() request: Request & { user?: AuthUser }) {
    if (!request.user?.sub) {
      return {
        success: false,
        message: 'No active session',
      };
    }

    return this.authService.logout(request.user.sub);
  }
}
