import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BasicMessage } from './interfaces/BasicMessage';
import { CreateGameDto } from 'src/games/dto/create-game.dto';
import { ConfigService } from '@nestjs/config';

const SYSTEM_INSTRUCTION = (
  theme: string,
  language: string,
  vocabulary: string,
  synonymsCount: number,
) => `
# Role:
Eres un generador de palabras para un juego de adivinanzas. Tu tarea es crear una palabra en ${language} junto con sinónimos que ayuden a los jugadores a adivinar la palabra.

# Reglas:
- La palabra debe estar relacionada con el tema ${theme}.
- La palabra deber ser utilizada en el vocabulario de ${vocabulary}.
- Debes generar exactamente ${synonymsCount} sinónimos.
- Los sinonimos deben ser unicamente  una palabra.
- Los sinónimos no deben ser demasiado obvios, pero deben estar relacionados con la palabra original.
- No debes incluir la palabra original en los sinónimos.
- No debes proporcionar definiciones o explicaciones, solo la palabra y los sinónimos.
- Tu respuesta debe ser unicamente un texto con la palabra y sus sinónimos, sin explicaciones adicionales.
- Solo texto, nada de markdown.

# Formato de salida:
Dame una palabra en ${language} relacionada con el tema ${theme} y el vocabulario ${vocabulary} y dame ${synonymsCount} palabras que sean sinónimos que ayuden a adivinar la palabra original, pero no menciones directamente la palabra en las pistas.

El resultado debe tener el siguiente formato JSON:
{"word":"<palabra generada>","synonyms":["<sinónimo 1>","<sinónimo 2>"]}
# Ejemplo de salida esperada:
{"word":"Autobús","synonyms":["Transporte","Vehículo"]}`;

@Injectable()
export class RoomsService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  private chatHistory = new Map<string, BasicMessage[]>();

  async start(roomId: string, createGameDto: CreateGameDto) {
    const { theme, language, vocabulary, outsiders } = createGameDto;

    const history = this.chatHistory.get(roomId) || [];

    const instructionMessage = SYSTEM_INSTRUCTION(
      theme,
      language,
      vocabulary,
      outsiders,
    );

    const chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history.map((message) => ({
        role: message.role,
        parts: [{ text: message.content }],
      })),
      config: {
        systemInstruction: instructionMessage,
        thinkingConfig: {
          includeThoughts: false,
          thinkingBudget: -1, // unlimited
        },
      },
    });

    const response = await chat.sendMessage({
      message: 'Genera una palabra y los sinónimos para el juego.',
    });

    const subjectJson = response.text
      ? JSON.parse(response.text)
      : { word: '', synonyms: [] };

    history.push({
      role: 'user',
      content: 'Genera una nueva palabra y los sinónimos para el juego.',
    });

    history.push({
      role: 'model',
      content: response.text || '',
    });

    this.chatHistory.set(roomId, history);

    return subjectJson;
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
