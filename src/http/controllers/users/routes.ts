import { FastifyInstance } from 'fastify'
import { register } from './register'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { completeProfile } from './complete-profile'


export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.put('/users/me/complete-profile', { onRequest: [verifyJwt] }, completeProfile)
}