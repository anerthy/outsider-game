import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto, CreatePlayerDto } from './dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Post(':id/players')
  addPlayer(@Param('id') id: string, @Body() playerDto: CreatePlayerDto) {
    return this.roomsService.addPlayer(id, playerDto);
  }

  @Delete(':id/players/:name')
  removePlayer(@Param('id') id: string, @Param('name') name: string) {
    return this.roomsService.removePlayer(id, name);
  }

  // @Patch(':id/games')
  // createGame(@Param('id') id: string, @Body() createGameDto: CreateGameDto) {
  //   return this.roomsService.createGame(id, createGameDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(id);
  }
}
