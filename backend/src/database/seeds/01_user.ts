import bcrypt from 'bcrypt'
import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error(
      'Configure SEED_ADMIN_EMAIL e SEED_ADMIN_PASSWORD.',
    )
  }

  const existingUser = await knex('users').where({ email }).first('id')

  if (existingUser) {
    console.log(`Usuário ${email} já existe. Seeder ignorado.`)
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await knex('users').insert({
    email,
    password_hash: passwordHash,
  })

  console.log(`Administrador ${email} criado com sucesso.`)
}