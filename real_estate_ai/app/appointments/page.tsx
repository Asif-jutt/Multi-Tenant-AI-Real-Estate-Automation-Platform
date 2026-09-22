import { AppShell } from '../../src/components/layout/AppShell';
import { AppointmentsModule } from '../../src/components/appointments/AppointmentsModule';

export default function AppointmentsPage() {
  return (
    <AppShell>
      <AppointmentsModule />
    </AppShell>
  );
}
