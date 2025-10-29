import { Route, Switch } from 'wouter'
import Login from '@/pages/Login'
import PasswordRecovery from '@/pages/PasswordRecovery'
import OTP from '@/pages/OTP'
import ChangePassword from '@/pages/ChangePassword'
import Dashboard from '@/pages/Dashboard'
import RequireAuth from '@/components/auth/RequireAuth'
import Users from '@/pages/Users'
import Memberships from '@/pages/Memberships'
import Metrics from '@/pages/Metrics'
import Reports from '@/pages/Reports'
import Revenues from '@/pages/Revenues'
import RevenuePeriod from '@/pages/Revenues/Period'
import UserReportsPage from '@/pages/Reports/User'
import Settings from '@/pages/Settings'
import AppLayout from '@/components/layout/AppLayout'
import { ROUTES } from '@/constants/routes'
import Notifications from '@/pages/Notifications'
import UserDetailPage from '@/pages/Users/Detail'
import { NotificationsProvider } from '@/contexts/NotificationsContext'
import { ToastProvider } from '@/contexts/ToastContext'

export function Routes() {
  return (
    <ToastProvider>
      <NotificationsProvider>
        <Switch>
        <Route path={ROUTES.login} component={Login} />
        <Route path={ROUTES.passwordRecovery} component={PasswordRecovery} />
        <Route path={ROUTES.otp} component={OTP} />
        <Route path={ROUTES.changePassword} component={ChangePassword} />
        <Route path={ROUTES.root} component={Login} />
        <Route path={ROUTES.dashboard}>
          <RequireAuth>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </RequireAuth>
        </Route>
      <Route path="/reports/:id">
        <RequireAuth>
          <AppLayout>
            <UserReportsPage />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path={ROUTES.users}>
        <RequireAuth>
          <AppLayout>
            <Users />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path="/users/:id">
        <RequireAuth>
          <AppLayout>
            <UserDetailPage />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path={ROUTES.memberships}>
        <RequireAuth>
          <AppLayout>
            <Memberships />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path={ROUTES.metrics}>
        <RequireAuth>
          <AppLayout>
            <Metrics />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path={ROUTES.reports}>
        <RequireAuth>
          <AppLayout>
            <Reports />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path={ROUTES.revenues}>
        <RequireAuth>
          <AppLayout>
            <Revenues />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path="/revenues/:period">
        <RequireAuth>
          <AppLayout>
            <RevenuePeriod />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path={ROUTES.settings}>
        <RequireAuth>
          <AppLayout>
            <Settings />
          </AppLayout>
        </RequireAuth>
      </Route>
      <Route path={ROUTES.notifications}>
        <RequireAuth>
          <AppLayout>
            <Notifications />
          </AppLayout>
        </RequireAuth>
      </Route>
    </Switch>
    </NotificationsProvider>
    </ToastProvider>
  )
}

export default Routes


