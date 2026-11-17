import {
  Bell,
  LayoutDashboard,
  ListTodo,
  Settings,
  UserCog,
  Users,
} from 'lucide-react'
import { type SidebarData } from '../types'

interface SidebarUser {
  name: string
  email: string
  avatar?: string | null
}

export function getSidebarData(user: SidebarUser): SidebarData {
  return {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar || '/avatars/default.jpg',
    },
    navGroups: [
      {
        title: 'Geral',
        items: [
          {
            title: 'Painel',
            url: '/',
            icon: LayoutDashboard,
          },
          {
            title: 'Eventos',
            url: '/events',
            icon: ListTodo,
          },
          {
            title: 'Inscrições',
            url: '/registrations',
            icon: Users,
          },
        ],
      },
      {
        title: 'Outros',
        items: [
          {
            title: 'Configurações',
            icon: Settings,
            items: [
              {
                title: 'Perfil',
                url: '/settings',
                icon: UserCog,
              },
              {
                title: 'Notificações',
                url: '/settings/notifications',
                icon: Bell,
              },
            ],
          },
        ],
      },
    ],
  }
}
