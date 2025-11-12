import { GoogleGenAI, Type } from "@google/genai";
import type { GameState } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyModel = 'gemini-2.5-flash';
const imageModel = 'imagen-4.0-generate-001';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    story: {
      type: Type.STRING,
      description: "현재 상황, 사건, 환경을 묘사하는 서술적인 단락입니다. 이야기는 흥미롭고 상세해야 합니다."
    },
    imagePrompt: {
      type: Type.STRING,
      description: "이야기를 시각적으로 표현하는 간결하고 설명적인 이미지 프롬프트입니다. 'dark fantasy, epic, cinematic, oil painting, dramatic lighting' 키워드를 반드시 포함해야 합니다."
    },
    inventory: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "플레이어의 현재 인벤토리를 나타내는 문자열 배열입니다. 스토리 이벤트에 따라 이 목록을 논리적으로 업데이트하세요."
    },
    currentQuest: {
      type: Type.STRING,
      description: "플레이어의 주요 목표를 간결하게 설명하는 문자열입니다. 스토리가 진행됨에 따라 업데이트하세요."
    },
    choices: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "플레이어가 선택할 수 있는 3개의 독특하고 실행 가능한 선택지 배열입니다. 이 선택지들은 다음 이야기에 실질적인 영향을 미쳐야 합니다."
    },
  },
  required: ["story", "imagePrompt", "inventory", "currentQuest", "choices"]
};

const getSystemInstruction = (history: string, inventory: string[], quest: string, choice: string) => `
당신은 무한 텍스트 기반 선택형 어드벤처 게임의 던전 마스터입니다. 당신의 목표는 플레이어의 선택에 따라 변화하는 역동적이고 매력적인 다크 판타지 스토리를 한국어로 만드는 것입니다.

각 턴마다 지금까지의 이야기, 플레이어의 현재 인벤토리, 현재 퀘스트, 그리고 마지막 선택을 받게 됩니다. 이를 바탕으로, 제공된 스키마를 준수하는 단일 유효 JSON 객체로 응답을 생성해야 합니다.

플레이어의 선택을 이야기에서 반복하지 마세요. 이야기는 선택의 직접적인 결과여야 합니다.

현재 상태:
- 인벤토리: [${inventory.join(', ')}]
- 퀘스트: ${quest}

이전 스토리 맥락:
${history}

플레이어의 마지막 선택:
"${choice}"

이제, 지정된 JSON 형식으로 모험의 다음 부분을 생성하세요.
`;

export const getNextStep = async (
  history: string,
  inventory: string[],
  quest: string,
  choice: string
): Promise<GameState> => {
  const systemInstruction = getSystemInstruction(history, inventory, quest, choice);
  
  const response = await ai.models.generateContent({
    model: storyModel,
    contents: "이야기를 계속 진행하세요.",
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.9,
    }
  });

  const jsonText = response.text.trim();
  try {
    return JSON.parse(jsonText) as GameState;
  } catch (e) {
    console.error("Failed to parse Gemini response as JSON:", jsonText);
    throw new Error("이야기가 예상치 못한 방향으로 흘러갔습니다. 다른 선택지를 시도해 주세요.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const fullPrompt = `${prompt}, dark fantasy, epic, cinematic, oil painting, dramatic lighting, high detail`;
  const response = await ai.models.generateImages({
      model: imageModel,
      prompt: fullPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
  });

  const base64ImageBytes = response.generatedImages[0].image.imageBytes;
  return `data:image/jpeg;base64,${base64ImageBytes}`;
};