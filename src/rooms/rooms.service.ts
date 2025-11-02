import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Room } from './entities/room.entity';
import { CreatePlayerDto, CreateRoomDto, UpdateRoomDto } from './dto';

@Injectable()
export class RoomsService {
  private rooms: Room[] = [
    {
      id: '2ede74e9-915a-4fa9-bc0c-db1b4ecf1165',
      name: 'Fun Room',
      code: 'ABC123',
      owner: 'andres',
      players: ['andres', 'rosi', 'julian', 'fernando', 'capis'],
      createdAt: new Date(),
    },
  ];

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

  removePlayer(roomId: string, playerName: string) {
    const room = this.findOne(roomId);

    if (!room.players.includes(playerName)) {
      throw new BadRequestException(`Player ${playerName} not found in room`);
    }

    room.players = room.players.filter((name) => name !== playerName);
  }

  remove(id: string) {
    const room = this.findOne(id);
    this.rooms = this.rooms.filter((r) => r.id !== room.id);
    return room;
  }
}
