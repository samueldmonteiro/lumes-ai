export abstract class LLMProvider {
  abstract ask(prompt: string): Promise<string>;
}
