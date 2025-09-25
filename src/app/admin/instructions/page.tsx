

import { getAllInstructionsAction } from '@/lib/actions';
import InstructionsManagement from './instructions-management';

export default async function InstructionsAdminPage() {
  const initialInstructions = await getAllInstructionsAction();

  return (
    <div>
        <InstructionsManagement initialInstructions={initialInstructions} />
    </div>
  );
}

