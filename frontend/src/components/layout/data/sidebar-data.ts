import {
  Bell,
  Users,
  LayoutDashboard,
  ListTodo,
  Settings,
  UserCog,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
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
          url: '/clients',
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
