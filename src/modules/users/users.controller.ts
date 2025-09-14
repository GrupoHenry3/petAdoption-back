<<<<<<< Updated upstream
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
=======
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus, HttpCode, NotFoundException, UsePipes, ValidationPipe, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
// import IUser from './interfaces/user.interface';
import { toResponseUserAdminDto, toResponseUserDto } from './mappers/user.mapper';
import { ResponseUserAdminDto } from './dto/response-userAdmin.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { IUser } from './interfaces/user.interface';
>>>>>>> Stashed changes

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

<<<<<<< Updated upstream
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
=======
  // -------------------- CREATE --------------------
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createUser(@Body() newUser: CreateUserDto) {
    const createUser = await this.usersService.createUser(newUser);
    return new ResponseUserDto(toResponseUserDto(createUser));
>>>>>>> Stashed changes
  }
  // -------------------- CREATE --------------------

<<<<<<< Updated upstream
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
=======
  // // --------------------- READ ---------------------
  // @Get('all')
  // async getUsers(): Promise<ResponseUserAdminDto[]> {
  //   const users: IUser[] = await this.usersService.getUsers();
  //   return users.map((user) => new ResponseUserAdminDto(toResponseUserAdminDto(user)));
  // }

  // @Get('by-id/:id')
  // async getUserById(@Param('id') id: string) {
  //   // Validar que el ID recibido sea un número válido
  //   if (isNaN(+id)) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.BAD_REQUEST,
  //       message: 'El ID debe ser un número válido',
  //       detail: `El valor recibido fue: "${id}"`,
  //       timestamp: new Date().toISOString(),
  //     });
  //   }
  //   const user = await this.usersService.getUserById(+id);
  //   const mappedUser: ResponseUserDto = toResponseUserDto(user);
  //   return new ResponseUserDto(mappedUser);
  // }

  // @Get('by-email/:email')
  // async getUserByEmail(@Param('email') email: string) {
  //   // Validar formato de email (simple regex)
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!emailRegex.test(email)) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.BAD_REQUEST,
  //       message: 'Formato de email inválido',
  //       detail: `El valor recibido fue: "${email}"`,
  //       timestamp: new Date().toISOString(),
  //     });
  //   }
  //   const user = await this.usersService.getUserByEmail(email);
  //   const mappedUser: ResponseUserDto = toResponseUserDto(user);
  //   return new ResponseUserDto(mappedUser);
  // }

  // @Get('by-userName/:userName')
  // async getUserByUserName(@Param('userName') userName: string) {
  //   // Validar que el userName no sea vacío ni tenga espacios inválidos
  //   if (!userName || userName.trim().length < 3) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.BAD_REQUEST,
  //       message: 'Formato de username inválido',
  //       detail: `El valor recibido fue: "${userName}"`,
  //       timestamp: new Date().toISOString(),
  //     });
  //   }
  //   const user = await this.usersService.getUserByUserName(userName);
  //   const mappedUser: ResponseUserDto = toResponseUserDto(user);
  //   return new ResponseUserDto(mappedUser);
  // }
  // // --------------------- READ ---------------------

  // // -------------------- UPDATE --------------------
  // @HttpCode(HttpStatus.OK)
  // @Patch(':id')
  // async updateUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateData: UpdateUserDto,
  // ) {
  //   // Validar que el body no esté vacío
  //   if (!updateData || Object.keys(updateData).length === 0) {
  //     throw new BadRequestException({
  //       statusCode: HttpStatus.BAD_REQUEST,
  //       message: 'Datos de actualización vacíos',
  //       detail: 'Debe enviar al menos un campo para actualizar',
  //       timestamp: new Date().toISOString(),
  //     });
  //   }
  //   const updatedUser = await this.usersService.updateUser(id, updateData);
  //   const mappedUser: ResponseUserDto = toResponseUserDto(updatedUser);
  //   return new ResponseUserDto(mappedUser);
  // }
  // // -------------------- UPDATE --------------------

  // // -------------------- DELETE --------------------
  // @Delete(':id')
  // async deleteUser(@Param('id', ParseIntPipe) id: number) {
  //   await this.usersService.deleteUser(id);
  //   return {
  //     status: HttpStatus.OK,
  //     message: `Usuario con el ID: ${id} eliminado correctamente.`,
  //   };
  // }
  // // -------------------- DELETE --------------------
}
>>>>>>> Stashed changes
