import { getFirmwareById, getBrandById, getSeriesById } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HardDrive, Calendar, Users, AlertTriangle, FileText, Zap } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getFlashingInstructions } from '@/ai/flows/get-flashing-instructions-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

async function FlashingInstructions({ brandId }: { brandId: string }) {
  const brand = await getBrandById(brandId);
  if (!brand) return null;

  const instructionsData = await getFlashingInstructions({ brandName: brand.name });

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FileText className="mr-3 h-6 w-6" />
        Full Instructions for {brand.name}
      </h2>
      <Card>
          <CardHeader>
              <CardTitle>Detailed Steps</CardTitle>
              <CardDescription>{instructionsData.introduction}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <div>
                  <h3 className="font-semibold mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {instructionsData.prerequisites.map((item, index) => (
                          <li key={index}>{item}</li>
                      ))}
                  </ul>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                  {instructionsData.instructions.map((step, index) => (
                      <AccordionItem value={`item-${index}`} key={index}>
                          <AccordionTrigger>Step {index + 1}: {step.title}</AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {step.description}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
              </Accordion>

              <div className="flex items-start p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 mr-3 text-destructive" />
                  <div>
                      <h4 className="font-semibold text-destructive">Warning</h4>
                      <p className="text-sm text-destructive/80">{instructionsData.warning}</p>
                  </div>
              </div>

          </CardContent>
      </Card>
    </div>
  )
}

function QuickInstructionsBanner() {
    // In a real scenario, this could be dynamic based on the brand
    const steps = ['Insert SD Card', 'Start Flash', 'Setup Device'];
    return (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-8">
            <div className="flex items-center">
                <Zap className="h-6 w-6 mr-3 text-primary"/>
                <h3 className="font-semibold text-lg text-primary">Quick Flash Guide:</h3>
                <p className="ml-2 text-muted-foreground hidden md:block">
                    {steps.join(' → ')} (Full Guide Below)
                </p>
            </div>
            <p className="mt-2 text-muted-foreground md:hidden">
                {steps.join(' → ')} (Full Guide Below)
            </p>
        </div>
    )
}

export default async function DownloadPage({ params }: { params: { firmwareId: string } }) {
  const firmware = await getFirmwareById(params.firmwareId);
  if (!firmware) notFound();

  const series = await getSeriesById(firmware.seriesId);
  if (!series) notFound();

  const brand = await getBrandById(series.brandId);
  if (!brand) notFound();

  const { fileName, size, uploadDate, downloadCount } = firmware;
  // @ts-ignore
  const date = uploadDate.toDate ? uploadDate.toDate() : new Date(uploadDate);

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {brand.name} {series.name} Firmware
      </h1>
      <p className="text-muted-foreground mb-8 break-words">
        File: {fileName}
      </p>

      <QuickInstructionsBanner />

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center">
            <div className="flex flex-col items-center">
              <HardDrive className="h-6 w-6 mb-2 text-muted-foreground" />
              <span className="font-semibold">File Size</span>
              <span className="text-muted-foreground">{size}</span>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-6 w-6 mb-2 text-muted-foreground" />
              <span className="font-semibold">Upload Date</span>
              <span className="text-muted-foreground">{format(date, 'PPP')}</span>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-6 w-6 mb-2 text-muted-foreground" />
              <span className="font-semibold">Downloads</span>
              <span className="text-muted-foreground">{downloadCount.toLocaleString()}</span>
            </div>
          </div>

          <Link href={firmware.downloadUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block">
            <Button className="w-full" variant="accent" size="lg">
              <Download className="mr-2 h-5 w-5" />
              Start Download
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <FlashingInstructions brandId={series.brandId} />
    </div>
  );
}
