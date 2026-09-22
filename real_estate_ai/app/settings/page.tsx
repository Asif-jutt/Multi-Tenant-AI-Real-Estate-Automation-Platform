import { AppShell } from '../../src/components/layout/AppShell';
import { SettingsModule } from '../../src/components/settings/SettingsModule';

export default function SettingsPage() {
  return (
    <AppShell>
      <SettingsModule />
    </AppShell>
  );
}
