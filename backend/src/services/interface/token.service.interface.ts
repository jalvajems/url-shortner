export const ITOKEN_SERVICE = 'ITOKEN_SERVICE';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface ITokenService {
  generateAccessToken(payload: JwtPayload): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
}
