export abstract class Bundler {
  constructor(cfg: any) {
    console.log(cfg, '<-- cfg');
  }

  abstract dev(): void;
  abstract build(): void;
}
