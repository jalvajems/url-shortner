export const ISHORT_CODE_GENERATOR = 'ISHORT_CODE_GENERATOR';

export interface IShortCodeGenerator {
  generate(length?: number): string;
}
