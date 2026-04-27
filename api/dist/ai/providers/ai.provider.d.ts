export declare abstract class AIProvider {
    abstract ask(prompt: string): Promise<string>;
}
