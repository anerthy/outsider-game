import { GoogleGenAI } from '@google/genai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateTopicGameDto } from './dto/create-topic.game.dto';
import { BasicMessage, TopicGame } from './interfaces';

const SYSTEM_INSTRUCTION = (
  category: string,
  language: string,
  vocabularyCountry: string,
  hintsCount: number,
) => `
# Role:
Eres un generador de palabras para un juego de adivinanzas. Tu tarea es crear una palabra en ${language} junto con pistas que ayuden a los jugadores a adivinar la palabra.

# Reglas:
- La palabra debe estar relacionada con la categoría ${category}.
- La palabra deber ser utilizada en el vocabulario de ${vocabularyCountry}.
- Debes generar exactamente ${hintsCount} pistas.
- Las pistas deben ser unicamente  una palabra.
- Las pistas no deben ser demasiado obvios, pero deben estar relacionados con la palabra original.
- No debes incluir la palabra original en las pistas.
- No debes proporcionar definiciones o explicaciones, solo la palabra y las pistas.
- Tu respuesta debe ser unicamente un texto con la palabra y sus pistas, sin explicaciones adicionales.
- Solo texto, nada de markdown.

# Formato de salida:
Dame una palabra en ${language} relacionada con la categoría ${category} y el vocabulario ${vocabularyCountry} y dame ${hintsCount} palabras que sean pistas que ayuden a adivinar la palabra original, pero no menciones directamente la palabra en las pistas.

El resultado debe tener el siguiente formato JSON:
{"word":"<palabra generada>","hints":["<pista 1>","<pista 2>"]}
# Ejemplo de salida esperada:
{"word":"Autobús","hints":["Transporte","Vehículo"]}`;

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private chatHistory = new Map<string, BasicMessage[]>();

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateTopicGame(
    createTopicGameDto: CreateTopicGameDto,
  ): Promise<TopicGame> {
    const { roomId, category, language, vocabularyCountry, hintsCount } =
      createTopicGameDto;

    const history = this.chatHistory.get(roomId) || [];

    const instructionMessage = SYSTEM_INSTRUCTION(
      category,
      language,
      vocabularyCountry,
      hintsCount,
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
      message: 'Genera una palabra y las pistas para el juego.',
    });

    history.push({
      role: 'user',
      content: 'Genera una palabra y las pistas para el juego.',
    });

    history.push({
      role: 'model',
      content: response.text || '',
    });

    this.chatHistory.set(roomId, history);

    const topicGame = JSON.parse(response.text || '{}') as TopicGame;
    console.log('Generated TopicGame:', topicGame.word);
    return topicGame;
  }
}
