
/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 255
 *           example: usuario@email.com
 *         password:
 *           type: string
 *           format: password
 *           example: MinhaSenha123
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: usuario@email.com
 *         password:
 *           type: string
 *           format: password
 *           example: MinhaSenha123
 *
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         email:
 *           type: string
 *           format: email
 *           example: usuario@email.com
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: "#/components/schemas/AuthUser"
 *         token:
 *           type: string
 *           description: JWT utilizado para autenticação nas rotas protegidas.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *     AuthError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Credenciais inválidas.
 */
