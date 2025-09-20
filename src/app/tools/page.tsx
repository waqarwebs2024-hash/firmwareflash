
import { getAllTools } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Wrench } from 'lucide-react';

export default async function ToolsPage() {
  const tools = await getAllTools();

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">All Flashing Tools</h1>
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link href={`/tools/${tool.id}`} key={tool.id}>
              <Card className="h-full hover:shadow-primary/20 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-medium">{tool.name}</CardTitle>
                  <Wrench className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">View download & guide</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground mb-4">No tools have been added yet.</p>
          <p className="text-sm text-muted-foreground">
            Tools are added automatically when flashing instructions are generated for a new brand.
          </p>
        </div>
      )}
    </div>
  );
}
