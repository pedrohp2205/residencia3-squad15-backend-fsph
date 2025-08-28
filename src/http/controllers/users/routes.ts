import { FastifyInstance } from 'fastify'

// import { verifyJwt } from '@/http/middlewares/verify-jwt'

import { register } from './register'


export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
}