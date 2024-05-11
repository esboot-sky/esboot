export abstract class Bundler {
  abstract bundle(): Promise<void>;
}