import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetUsersDTO, UpdateUserDTO } from './user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiOkResponse()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Activate or deactivate an user (Admin)' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async updateStatus(@Param('id') id: string) {
    return await this.usersService.updateUserStatus(id);
  }

  @ApiOperation({ summary: 'Update current user' })
  @ApiOkResponse({ description: 'User updated successfully' })
  @Patch()
  @HttpCode(HttpStatus.OK)
  async update(@Req() req: any, @Body() payload: UpdateUserDTO) {
    return await this.usersService.update(req.user.id, payload);
  }

  @ApiOperation({ summary: 'Delete an user' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Delete()
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @Req() req) {
    return await this.usersService.delete(req.user.id);
  }

  @ApiOperation({ summary: 'List all users (Admin)' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async findAll(@Query() filters: GetUsersDTO) {
    return await this.usersService.findAll(filters);
  }

  @ApiOperation({ summary: 'Get current user' })
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req) {
    return await this.usersService.findCurrentUser(req.user.id);
  }

  @ApiOperation({ summary: 'Get a specific user' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
}
