import { db } from '../config/database.js'

export type User = {
  id: string
  email: string
  password_hash: string
  created_at: Date
  updated_at: Date
}

export type PublicUser = Omit<User, 'password_hash'>

export const UserModel = {
  async findByEmail(email: string): Promise<User | undefined> {
    return db<User>('users')
      .where({ email: email.trim().toLowerCase() })
      .first()
  },

  async findById(id: string): Promise<PublicUser | undefined> {
    const user = await db<User>('users')
      .select('id', 'email', 'created_at', 'updated_at')
      .where({ id })
      .first()

    return user
  },

  async create(data: {
    email: string
    passwordHash: string
  }): Promise<PublicUser> {
    const [user] = await db<User>('users')
      .insert({
        email: data.email.trim().toLowerCase(),
        password_hash: data.passwordHash,
      })
      .returning(['id', 'email', 'created_at', 'updated_at'])

    if (!user) {
      throw new Error('Não foi possível criar o usuário.')
    }

    return user
  },
}