import jwt from "jsonwebtoken";

/**
 * TokenService - Clase para manejar la creación y verificación de JWT.
 */
class TokenService {
  
  /**
   * Crea un token JWT.
   * @param {object} payload - El payload del token.
   * @param {string} secret - La clave secreta para firmar el token.
   * @returns {string} El token JWT.
   */
  static createToken(payload: object, secret: string): string {
    return jwt.sign(payload, secret, { expiresIn: "2d" });
  }

  /**
   * Verifica un token JWT.
   * @param {string} token - El token JWT a verificar.
   * @param {string} secret - La clave secreta usada para firmar el token.
   * @returns {object | null} El payload del token.
   */
  static verifyToken(token: string, secret: string): object | null {
    try {
      const payload = jwt.verify(token, secret);

      if (typeof payload == "object" && payload !== null) {
        return payload;
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log("El token ha expirado");
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log("Error en el token JWT");
      } else {
        console.log("Error desconocido al verificar el token");
      }
    }

    // Si el payload no es un objeto, devolvemos null
    return null;
  }
}

export default TokenService;
