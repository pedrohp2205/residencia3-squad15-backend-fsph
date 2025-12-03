import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { completeProfile } from './complete-profile'

export async function usersRoutes(app: FastifyInstance) {
  // POST /users — Registro
  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Registrar usuário',
        description: 'Cria um novo usuário com nome, e-mail, senha e CPF.',
        body: {
          type: 'object',
          required: ['name', 'email', 'password', 'cpf'],
          additionalProperties: true,
          properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            cpf: { type: 'string', minLength: 11, maxLength: 11 },
          },
        },
        response: {
          201: { type: 'null' },
          400: {
            type: 'object',
            additionalProperties: true,
            properties: { message: { type: 'string' } },
            required: ['message'],
          },
          409: {
            type: 'object',
            additionalProperties: true,
            properties: { message: { type: 'string' } },
            required: ['message'],
          },
          500: {
            type: 'object',
            additionalProperties: true,
            properties: { message: { type: 'string' } },
            required: ['message'],
          },
        },
      },
    },
    register
  )

  // PUT /users/me/complete-profile — Completar perfil
  app.put(
    '/users/me/complete-profile',
    {
      onRequest: [verifyJwt],
      schema: {
        tags: ['Users'],
        summary: 'Completar perfil do usuário autenticado',
        description:
          'Define telefone, sexo, tipo sanguíneo e data de nascimento do usuário autenticado.',
        body: {
          type: 'object',
          required: ['phone', 'sex', 'bloodType', 'dateOfBirth'],
          additionalProperties: true,
          properties: {
            phone: { type: 'string', minLength: 8, maxLength: 20 },
            sex: { type: 'string', enum: ['M', 'F', 'OTHER'] },
            bloodType: { type: 'string', enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
            // z.coerce.date() -> envie string de data; usamos pattern YYYY-MM-DD para evitar necessidade de plugins de formatos
            dateOfBirth: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
          },
        },
        response: {
          200: {
            type: 'object',
            additionalProperties: true,
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              phone: { type: 'string' },
              sex: { type: 'string', enum: ['M', 'F', 'OTHER'] },
              // Prisma BloodType enum no retorno
              bloodType: {
                type: 'string',
                enum: ['A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG'],
              },
              completed: { type: 'boolean' },
            },
            required: ['id', 'userId', 'phone', 'sex', 'bloodType', 'completed'],
          },
          401: {
            type: 'object',
            additionalProperties: true,
            properties: {
              statusCode: { type: 'number' },
              error: { type: 'string' },
              message: { type: 'string' },
            },
            required: ['statusCode', 'error', 'message'],
          },
          500: {
            type: 'object',
            additionalProperties: true,
            properties: { message: { type: 'string' } },
            required: ['message'],
          },
        },
      },
    },
    completeProfile
  )
}
