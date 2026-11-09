/**
 * @swagger
 * tags:
 *   name: Eventos
 *   description: Gerenciamento de eventos e retiros
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Criar evento
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EventInput"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autenticado.
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Listar eventos
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos.
 */

/**
 * @swagger
 * /events/{id}/status:
 *   patch:
 *     summary: Atualizar status do evento
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EventStatusInput"
 *     responses:
 *       200:
 *         description: Status atualizado.
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Buscar evento
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado.
 */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualizar evento
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EventInput"
 *     responses:
 *       200:
 *         description: Evento atualizado.
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Excluir evento
 *     tags: [Eventos]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Evento excluído.
 */
