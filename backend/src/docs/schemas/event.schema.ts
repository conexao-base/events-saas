/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - info
 *         - registration
 *         - appearance
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id:
 *           type: string
 *           format: uuid
 *           example: "550e8400-e29b-41d4-a716-446655440001"
 *         info:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: string
 *               maxLength: 120
 *               example: Retiro Conexão 2027
 *             description:
 *               type: string
 *               nullable: true
 *               example: Um tempo de comunhão e renovação espiritual.
 *             location:
 *               type: string
 *               maxLength: 255
 *               nullable: true
 *               example: Sítio Recanto Verde
 *             startDate:
 *               type: string
 *               format: date
 *               nullable: true
 *               example: "2027-01-15"
 *             endDate:
 *               type: string
 *               format: date
 *               nullable: true
 *               example: "2027-01-17"
 *             price:
 *               type: string
 *               example: "150,00"
 *         registration:
 *           type: object
 *           properties:
 *             fields:
 *               type: array
 *               items:
 *                 type: object
 *                 required:
 *                   - id
 *                   - label
 *                   - type
 *                   - required
 *                 properties:
 *                   id:
 *                     type: string
 *                     maxLength: 100
 *                     example: nome
 *                   label:
 *                     type: string
 *                     maxLength: 120
 *                     example: Nome completo
 *                   type:
 *                     type: string
 *                     enum: [text, email, phone, cpf, city, date, select]
 *                   required:
 *                     type: boolean
 *                     example: true
 *                   options:
 *                     type: array
 *                     items:
 *                       type: string
 *                       maxLength: 100
 *                     example: [Masculino, Feminino]
 *         appearance:
 *           type: object
 *           required:
 *             - primaryColor
 *           properties:
 *             primaryColor:
 *               type: string
 *               pattern: "^#[0-9a-fA-F]{6}$"
 *               example: "#245C43"
 *             coverImage:
 *               type: string
 *               format: uri
 *               example: "https://example.com/cover.jpg"
 *             logo:
 *               type: string
 *               format: uri
 *               example: "https://example.com/logo.png"
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           example: draft
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 *     EventStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           example: published
 */
