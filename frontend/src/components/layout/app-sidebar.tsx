import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from '@/components/ui/sidebar'
import { getSidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()

  const { data: user } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.me,
  })

  const sidebarData = user ? getSidebarData(user) : null

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarContent>
        {sidebarData?.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        {sidebarData && <NavUser user={sidebarData.user} />}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
