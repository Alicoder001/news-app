import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ViewArticleDto {
  @ApiProperty({ example: 'openai-gpt-5-chiqarildi' })
  @IsString()
  @IsNotEmpty()
  slug!: string;
}
