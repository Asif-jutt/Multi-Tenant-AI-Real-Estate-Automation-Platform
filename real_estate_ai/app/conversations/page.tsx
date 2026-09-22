import { AppShell } from '../../src/components/layout/AppShell';
import { ConversationsModule } from '../../src/components/conversations/ConversationsModule';

export default function ConversationsPage() {
  return (
    <AppShell>
      <ConversationsModule />
    </AppShell>
  );
}
