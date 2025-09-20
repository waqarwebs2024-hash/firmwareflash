import { getFirmwareById, getBrandById, getSeriesById, getFlashingInstructionsFromDB, saveFlashingInstructionsToDB, getOrCreateTool } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HardDrive, Calendar, Users, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getFlashingInstructions, FlashingInstructionsOutput } from '@/ai/flows/get-flashing-instructions-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

async function FlashingInstructions({ brandId, instructionsData }: { brandId: string, instructionsData: FlashingInstructionsOutput | null }) {
  const brand = await getBrandById(brandId);
  if (!brand) return null;
  
  if (!instructionsData) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="mr-3 h-6 w-6" />
                How to Flash {brand.name} Firmware (Step-by-Step)
            </h2>
            <p className="text-muted-foreground">Could not load flashing instructions at this time.</p>
        </section>
    )
  }

  const { introduction, prerequisites, instructions, warning, tool } = instructionsData;

  // Replace tool name with a link
  const renderWithToolLink = (text: string) => {
    if (!tool || !text.includes(tool.name)) {
      return text;
    }
    const parts = text.split(new RegExp(`(${tool.name})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === tool.name.toLowerCase() ? (
        <Link href={`/tools/${tool.slug}`} key={index} className="text-primary font-semibold hover:underline">{part}</Link>
      ) : (
        part
      )
    );
  };

  return (
    <section className="mb-8">
        <h2 className="text-2xl font-bold mb-2">How to Flash {brand.name} Firmware (Step-by-Step)</h2>
        <p className="text-muted-foreground mb-6">{renderWithToolLink(introduction)}</p>
        
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-2 text-lg">Prerequisites</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    {prerequisites.map((item, index) => (
                        <li key={index}>{renderWithToolLink(item)}</li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h3 className="font-semibold mb-2 text-lg">Flashing Steps</h3>
                <Accordion type="single" collapsible className="w-full rounded-lg border px-4">
                    {instructions.map((step, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className={index === instructions.length - 1 ? 'border-b-0' : ''}>
                            <AccordionTrigger>Step {index + 1}: {step.title}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                            {renderWithToolLink(step.description)}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    </section>
  )
}

export default async function DownloadPage({ params }: { params: { firmwareId: string } }) {
  const firmware = await getFirmwareById(params.firmwareId);
  if (!firmware) notFound();

  const series = await getSeriesById(firmware.seriesId);
  if (!series) notFound();

  const brand = await getBrandById(series.brandId);
  if (!brand) notFound();

  let instructionsData: FlashingInstructionsOutput | null = await getFlashingInstructionsFromDB(brand.id);

  if (!instructionsData) {
    instructionsData = await getFlashingInstructions({ brandName: brand.name });
    if (instructionsData) {
        if (instructionsData.tool) {
            // Ensure the tool exists in the DB, create it if not
            await getOrCreateTool(instructionsData.tool.slug, instructionsData.tool.name);
        }
      await saveFlashingInstructionsToDB(brand.id, instructionsData);
    }
  }

  const { fileName, size, uploadDate, downloadCount } = firmware;
  // @ts-ignore
  const date = uploadDate.toDate ? uploadDate.toDate() : new Date(uploadDate);

  return (
    <main className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        {brand.name} {series.name} Firmware Download & Flashing Guide
      </h1>

      <FlashingInstructions brandId={series.brandId} instructionsData={instructionsData} />

      <section className="bg-card border shadow-sm rounded-xl p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Download {series.name} Firmware</h2>
        <ul className="space-y-2 text-muted-foreground mb-6">
          <li><strong>File Name:</strong> <span className="break-all">{fileName}</span></li>
          <li><strong>File Size:</strong> {size}</li>
          <li><strong>Upload Date:</strong> {format(date, 'PPP')}</li>
          <li><strong>Downloads:</strong> {downloadCount.toLocaleString()}</li>
        </ul>
        <Link href={firmware.downloadUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block">
            <Button className="w-full" variant="accent" size="lg">
            <Download className="mr-2 h-5 w-5" />
            Start Download
            </Button>
        </Link>
      </section>

      {instructionsData?.warning && (
        <aside className="mt-8 bg-destructive/10 p-4 border border-destructive/20 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-3 text-destructive shrink-0 mt-0.5" />
            <div>
                <strong className="text-destructive font-semibold">Warning</strong>
                <p className="text-sm text-destructive/90">{instructionsData.warning}</p>
            </div>
        </aside>
      )}
    </main>
  );
}
