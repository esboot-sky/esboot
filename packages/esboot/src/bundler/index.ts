export abstract class Bundler {
  constructor() {}

  abstract dev(): void;
  abstract build(): void;
}
