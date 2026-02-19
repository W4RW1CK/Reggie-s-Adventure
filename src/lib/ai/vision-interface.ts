import { VisionResponse } from '../types';

export interface VisionProvider {
    evaluate(imageBase64: string, systemPrompt: string): Promise<VisionResponse>;
}
