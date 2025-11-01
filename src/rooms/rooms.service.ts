import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BasicMessage } from './interfaces/BasicMessage';

@Injectable()
export class RoomsService {
  private readonly ai = new GoogleGenAI({
    apiKey: 'AIzaSyCrI071lj2KyJucQJaTqz9CWiyDZZBZAyQ',
  });

  private chatHistory = new Map<string, BasicMessage[]>();

  async start(gameId: string) {
    const gameOptions = {
      theme: 'Objeto de cocina',
      language: 'es',
      vocabulary: 'Costa Rica',
      minLength: 6,
      maxLength: 10,
      synonymsCount: 2,
    };

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Quiero que generes una palabra en español relacionada con el siguiente tema: ${gameOptions.theme}.

        La palabra debe ser concreta y común en ese campo.
        La palabra debe tener entre ${gameOptions.minLength} y ${gameOptions.maxLength} letras y no debe ser demasiado obvia.
        La palabra deber ser utilizada en el vocabulario de ${gameOptions.vocabulary}.

        Luego, dame ${gameOptions.synonymsCount} palabras que sean sinónimos que ayuden a adivinar la palabra original, pero no menciones directamente la palabra en las pistas.

        El resultado debe tener el siguiente formato JSON:
        {
        "word": "<palabra generada>",
        "synonyms": ["<sinónimo 1>", "<sinónimo 2>", ...]
        }

        Ejemplo de salida esperada:
        {
        "word":"Autobús",
        "synonyms": ["Transporte", "Vehículo"]
        }

        Tu respuesta debe ser unicamente un JSON con tu informacion de las palabras`,
    });
    console.log(response);
    return {
      response: response.text,
    };
  }

  create(createRoomDto: CreateRoomDto) {
    console.log(createRoomDto);
    return 'This action adds a new room';
  }

  findAll() {
    return `This action returns all rooms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    console.log(updateRoomDto);
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
