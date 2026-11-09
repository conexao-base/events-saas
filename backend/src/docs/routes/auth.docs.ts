/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Cadastro, login e gerenciamento da sessão do usuário
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Criar conta
 *     description: Registra um novo usuário na plataforma.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterInput"
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Dados inválidos ou e-mail já cadastrado.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Entrar na plataforma
 *     description: Autentica o usuário e retorna um token JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginInput"
 *           example:
 *             email: admin@example.com
 *             password: Retiro@Admin2026!K8v
 *     responses:
 *       200:
 *         description: Autenticação realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: E-mail ou senha incorretos.
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Consultar usuário autenticado
 *     description: Retorna os dados do usuário identificado pelo token JWT.
 *     tags: [Autenticação]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do usuário retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthUser"
 *       401:
 *         description: Token ausente, inválido ou expirado.
 */
