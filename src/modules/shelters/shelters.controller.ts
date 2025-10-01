import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SheltersService } from './shelters.service';
import { ShelterDTO, GetSheltersDTO, UpdateShelterDTO, Shelter } from './shelters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UserTypeGuard } from '../auth/guards/user-type.guard';
import { UserTypes } from '../auth/auth.decorator';
import { UserType } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('shelters')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
export class SheltersController {
  constructor(private readonly sheltersService: SheltersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a shelter application' })
  @ApiOkResponse({ description: 'Shelter application submitted successfully' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, UserTypeGuard)
  @UserTypes(UserType.User)
  async create(@Body() payload: ShelterDTO, @Req() req: any) {
    return await this.sheltersService.create(payload, req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific shelter' })
  @ApiBody({
    type: UpdateShelterDTO,
  })
  @ApiOkResponse({ description: 'Shelter updated successfully', type: Shelter })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserTypeGuard)
  @UserTypes(UserType.Shelter)
  async update(@Param('id') id: string, @Body() payload: UpdateShelterDTO) {
    return await this.sheltersService.update(id, payload);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a shelter' })
  @ApiOkResponse({ description: 'Shelter deactivated successfully' })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserTypeGuard)
  @UserTypes(UserType.Shelter)
  async updateStatus(@Param('id') id: string) {
    return await this.sheltersService.updateStatus(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify a shelter (Admin)' })
  @ApiOkResponse({ description: 'Shelter verified successfully' })
  @Patch(':id/verify')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async verify(@Param('id') id: string) {
    return await this.sheltersService.verify(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate / Deactivate a shelter (Admin)' })
  @ApiOkResponse({ description: 'Shelter deactivated successfully' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string) {
    return await this.sheltersService.delete(id);
  }

  @ApiOperation({ summary: 'List all shelters' })
  @ApiOkResponse({ description: 'List of all shelters', type: [Shelter] })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filters: GetSheltersDTO) {
    return await this.sheltersService.findAll(filters);
  }

  @ApiOperation({ summary: 'Get a specific shelter' })
  @ApiOkResponse({ description: 'Shelter details fetched successfully', type: Shelter })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.sheltersService.findOne(id);
  }
}
