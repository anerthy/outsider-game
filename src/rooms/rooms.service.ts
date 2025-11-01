import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { Room } from './entities/room.entity';
import { v4 as uuid } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CreatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class RoomsService {
  private readonly ai: GoogleGenAI;
  private rooms: Room[] = [];

  findAll() {
    return this.rooms;
  }

  findOne(id: string) {
    const room = this.rooms.find((room) => room.id === id || room.code === id);

    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }

    return room;
  }

  create(createRoomDto: CreateRoomDto) {
    const { name, code, owner } = createRoomDto;

    const room = this.rooms.find((room) => room.code === code);
    if (room) {
      throw new BadRequestException(`Room with code ${code} already exists`);
    }
    const newRoom: Room = {
      id: uuid(),
      name: name ?? 'New Room',
      code: code,
      owner: owner,
      players: [owner],
      createdAt: new Date(),
    };

    this.rooms.push(newRoom);

    return newRoom;
  }

  update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = this.findOne(id);
    const updatedRoom = { ...room, ...updateRoomDto };
    this.rooms = this.rooms.map((r) => (r.id === room.id ? updatedRoom : r));
    return updatedRoom;
  }

  addPlayer(roomId: string, createPlayerDto: CreatePlayerDto) {
    const { name } = createPlayerDto;
    const room = this.findOne(roomId);

    if (room.players.includes(name)) {
      throw new BadRequestException(`Player ${name} already in room`);
    }

    room.players.push(name);
  }

  remove(id: string) {
    const room = this.findOne(id);
    this.rooms = this.rooms.filter((r) => r.id !== room.id);
    return room;
  }
}
