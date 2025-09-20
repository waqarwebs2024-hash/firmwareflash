import { getFirmwareById, getBrandById, getSeriesById, getFlashingInstructionsFromDB, saveFlashingInstructionsToDB } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HardDrive, Calendar, Users, AlertTriangle, FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getFlashingInstructions, FlashingInstructionsOutput } from '@/ai/flows/get-flashing-instructions-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

async function FlashingInstructions({ brandId }: { brandId: string }) {
  const brand = await getBrandById(brandId);
  if (!brand) return null;

  let instructionsData: FlashingInstructionsOutput | null = await getFlashingInstructionsFromDB(brand.id);

  if (!instructionsData) {
    instructionsData = await getFlashingInstructions({ brandName: brand.name });
    if(instructionsData) {
      await saveFlashingInstructionsToDB(brand.id, instructionsData);
    }
  }
  
  if (!instructionsData) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <FileText className="mr-3 h-6 w-6" />
                    Flashing Guide
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Could not load flashing instructions at this time.</p>
            </CardContent>
        </Card>
    )
  }


  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center">
                <FileText className="mr-3 h-6 w-6" />
                Flashing Guide for {brand.name}
            </CardTitle>
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
                <AlertTriangle className="h-5 w-5 mr-3 text-destructive shrink-0 mt-1" />
                <div>
                    <h4 className="font-semibold text-destructive">Warning</h4>
                    <p className="text-sm text-destructive/80">{instructionsData.warning}</p>
                </div>
            </div>

        </CardContent>
    </Card>
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
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        {brand.name} {series.name} Firmware
      </h1>
      <p className="text-muted-foreground mb-8 break-words">
        File: {fileName}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Download Card */}
        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Download Firmware</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center">
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                        <HardDrive className="h-6 w-6 mb-2 text-muted-foreground" />
                        <span className="font-semibold">File Size</span>
                        <span className="text-muted-foreground">{size}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                        <Calendar className="h-6 w-6 mb-2 text-muted-foreground" />
                        <span className="font-semibold">Upload Date</span>
                        <span className="text-muted-foreground">{format(date, 'PPP')}</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
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
        </div>

        {/* Right Column: Flashing Instructions */}
        <div className="row-start-1 lg:row-auto">
            <FlashingInstructions brandId={series.brandId} />
        </div>

      </div>
    </div>
  );
}
