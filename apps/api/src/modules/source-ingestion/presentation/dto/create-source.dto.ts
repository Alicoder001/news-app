import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, IsUrl } from 'class-validator';

const SOURCE_TYPES = ['NEWS_API', 'RSS', 'SCRAPER'] as const;

export class CreateSourceDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: SOURCE_TYPES, default: 'RSS' })
  @IsOptional()
  @IsIn(SOURCE_TYPES)
  type?: (typeof SOURCE_TYPES)[number] = 'RSS';

  @ApiProperty()
  @IsUrl()
  url!: string;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
