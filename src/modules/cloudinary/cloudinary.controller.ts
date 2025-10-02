import { Controller, Get, UseGuards } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserType } from '@prisma/client';
import { UserTypes } from '../auth/auth.decorator';

@ApiTags('Cloudinary')
@Controller('cloudinary')
@UseGuards(JwtAuthGuard, UserTypeGuard)
@UserTypes(UserType.Shelter)
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('signature')
  @ApiOperation({
    summary: 'Get Cloudinary upload signature',
    description:
      'Generates a signed payload required to securely upload files directly to Cloudinary from the client.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a valid Cloudinary upload signature.',
    schema: {
      example: {
        timestamp: 1695034567,
        signature: 'abcdef1234567890',
        cloudName: 'your-cloud-name Example: dbngufqmd',
        apiKey: '439395776798433',
      },
    },
  })
  getSignature() {
    return this.cloudinaryService.generateSignature();
  }
}
