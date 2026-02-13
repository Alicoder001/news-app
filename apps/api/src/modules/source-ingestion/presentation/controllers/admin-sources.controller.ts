import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SourcesService } from '../../application/services/sources.service';
import { CreateSourceDto } from '../dto/create-source.dto';
import { UpdateSourceDto } from '../dto/update-source.dto';
import { AdminAuditInterceptor } from '../../../identity-access/infrastructure/interceptors/admin-audit.interceptor';
import { JwtAuthGuard } from '../../../identity-access/infrastructure/security/jwt-auth.guard';
import { Roles } from '../../../identity-access/infrastructure/security/roles.decorator';
import { RolesGuard } from '../../../identity-access/infrastructure/security/roles.guard';

@ApiTags('admin-sources')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'EDITOR')
@UseInterceptors(AdminAuditInterceptor)
@Controller('admin/sources')
export class AdminSourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Get()
  @ApiOperation({ summary: 'List sources' })
  list() {
    return this.sourcesService.list();
  }

  @Post()
  @ApiOperation({ summary: 'Create source (phase-1 scaffold)' })
  create(@Body() dto: CreateSourceDto) {
    return this.sourcesService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update source (phase-1 scaffold)' })
  update(@Param('id') id: string, @Body() dto: UpdateSourceDto) {
    return this.sourcesService.update(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Toggle source status (phase-1 scaffold)' })
  toggle(@Param('id') id: string) {
    return this.sourcesService.toggle(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete source (phase-1 scaffold)' })
  remove(@Param('id') id: string) {
    return this.sourcesService.remove(id);
  }
}
