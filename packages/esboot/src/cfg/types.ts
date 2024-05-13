import { Bundler } from '../bundle';

export interface UserConfig {
  bundler: Bundler | null;
  outputPath?: string;
  publicPath?: string;
  analyze?: boolean;
  alias?: Record<string, string>;
  define?: Record<string, string>;
  sourceMap?: boolean;
  copy?: Record<string, string>;
}
