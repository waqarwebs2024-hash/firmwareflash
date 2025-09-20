
import { getApiKey } from '@/lib/data';
import { ApiKeyForm } from './api-key-form';

export default async function SettingsPage() {
  const apiKey = await getApiKey();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <ApiKeyForm initialApiKey={apiKey} />
    </div>
  );
}
