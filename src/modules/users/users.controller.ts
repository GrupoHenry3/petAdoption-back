import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseUserDto } from "./dto/response-user.dto";
import { toResponseUserAdminDto, toResponseUserDto } from "./mappers/user.mapper";
import { ResponseUserAdminDto } from "./dto/response-userAdmin.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { isUUID } from "class-validator";
import { toLocalDate } from "src/utils/dateUtils";
import { UpdateStatusUserDto } from "./dto/update-status-user.dto";

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) { }

  // -------------------- CREATE --------------------
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createUser(@Body() newUser: CreateUserDto) {
    const user = await this.usersService.createUser(newUser);
    this.logger.log(`Usuario creado con ID: ${user.id}`);
    return new ResponseUserDto(toResponseUserDto(user));
  }
  // -------------------- CREATE --------------------

  // --------------------- READ ---------------------
  @Get('all')
  async getUsers(): Promise<ResponseUserAdminDto[]> {
    const users = await this.usersService.getUsers();
    this.logger.log(`Usuarios consultados. Total: ${users.length}`);
    return users.map((user) => new ResponseUserAdminDto(toResponseUserAdminDto(user)));
  }

  @Get('by-id/:id')
  async getUserById(@Param('id') id: string): Promise<ResponseUserDto> {
    // Validar UUID
    if (!isUUID(id)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'El ID debe ser un UUID válido',
        detail: `Valor recibido: "${id}"`,
        timestamp: toLocalDate(new Date()), // Timestamp en hora local
      });
    }
    const user = await this.usersService.getUserById(id);
    return new ResponseUserDto(user); // Mapping dentro del DTO
  }

  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<ResponseUserDto> {
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Formato de email inválido',
        detail: `Valor recibido: "${email}"`,
        timestamp: toLocalDate(new Date()),
      });
    }
    const user = await this.usersService.getUserByEmail(email);
    // Mapeo manual para evitar errores de TypeScript
    return new ResponseUserDto(user);
  }
  // --------------------- READ ---------------------

  // -------------------- UPDATE --------------------
  @HttpCode(HttpStatus.OK)
  @Patch('update-id/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    // Validar UUID
    if (!isUUID(id)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'El ID debe ser un UUID válido',
        detail: `Valor recibido: "${id}"`,
        timestamp: toLocalDate(new Date()),
      });
    }
    const updatedUser = await this.usersService.updateUser(id, updateData);
    // Mapeo manual para evitar errores de TypeScript
    return new ResponseUserDto(updatedUser);
  }
  // -------------------- UPDATE --------------------

  // -------------------- DELETE --------------------
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    // Validar que el ID sea un UUID válido
    if (!isUUID(id)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'El ID debe ser un UUID válido',
        detail: `El valor recibido fue: "${id}"`,
        timestamp: new Date().toISOString(),
      });
    }

    await this.usersService.deleteUser(id);
    return {
      status: HttpStatus.OK,
      message: `Usuario con el ID: ${id} eliminado correctamente.`,
    };
  }
  // -------------------- DELETE --------------------

  // -------------------- STATUS --------------------
  @Patch('status-id/:id')
  @HttpCode(HttpStatus.OK)
  async updateUserStatus(
    @Param('id') id: string,
    @Body() body: UpdateStatusUserDto
  ) {
    // Validar UUID
    if (!isUUID(id)) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'El ID debe ser un UUID válido',
        detail: `Valor recibido: "${id}"`,
        timestamp: toLocalDate(new Date()),
      });
    }

    const updatedUser = await this.usersService.updateUserStatus(id, body.isActive);

    return {
      message: `Usuario ${updatedUser.fullName} ${updatedUser.isActive ? 'activado' : 'desactivado'} correctamente`,
      user: updatedUser,
    };
  }
  // -------------------- STATUS --------------------
}