

import { getApiKey, getHeaderScripts } from '@/lib/data';
import { ApiKeyForm } from './api-key-form';
import { HeaderScriptsForm } from './header-scripts-form';
import { Separator } from '@/components/ui/separator';

export default async function SettingsPage() {
  const apiKey = await getApiKey();
  const headerScripts = await getHeaderScripts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className='space-y-8'>
        <ApiKeyForm initialApiKey={apiKey} />
        <Separator />
        <HeaderScriptsForm initialScripts={headerScripts} />
      </div>
    </div>
  );
}
