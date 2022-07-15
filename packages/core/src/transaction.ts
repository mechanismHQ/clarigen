export interface ResultAssets {
  stx: Record<string, string>;
  burns: Record<string, string>;
  tokens: Record<string, Record<string, string>>;
  assets: Record<string, Record<string, string>>;
}
