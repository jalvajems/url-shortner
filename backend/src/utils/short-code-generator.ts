import { Injectable } from '@nestjs/common';
import { IShortCodeGenerator } from './short-code-generator.interface';

@Injectable()
export class ShortCodeGenerator implements IShortCodeGenerator {
  private readonly characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  generate(length: number = 6): string {
    let result = '';
    const charactersLength = this.characters.length;
    for (let i = 0; i < length; i++) {
      result += this.characters.charAt(
        Math.floor(Math.random() * charactersLength),
      );
    }
    return result;
  }
}
