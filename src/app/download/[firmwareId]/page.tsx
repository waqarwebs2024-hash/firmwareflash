import { getFirmwareById, getBrandById, getSeriesById } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HardDrive, Calendar, Users, AlertTriangle, FileText } from 'lucide-react';
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
      <Card className="mt-8">
          <CardHeader>
              <CardTitle className="flex items-center">
                  <FileText className="mr-3" />
                  Flashing Instructions for {brand.name}
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
                  <AlertTriangle className="h-5 w-5 mr-3 text-destructive" />
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

  if (!firmware) {
    notFound();
  }

  // To get the brand, we need to get the series first
  const series = await getSeriesById(firmware.seriesId);
  if(!series){
    // This case should ideally not happen if data integrity is maintained
    notFound();
  }

  const { fileName, size, uploadDate, downloadCount } = firmware;
  // @ts-ignore
  const date = uploadDate.toDate ? uploadDate.toDate() : new Date(uploadDate);


  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold break-words">
            {fileName}
          </CardTitle>
          <CardDescription>Ready to download.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <HardDrive className="mr-3 text-muted-foreground" />
                <span className="font-medium">File Size</span>
              </div>
              <span className="text-muted-foreground">{size}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <Calendar className="mr-3 text-muted-foreground" />
                <span className="font-medium">Upload Date</span>
              </div>
              <span className="text-muted-foreground">{format(date, 'PPP')}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <Users className="mr-3 text-muted-foreground" />
                <span className="font-medium">Downloads</span>
              </div>
              <span className="text-muted-foreground">{downloadCount.toLocaleString()}</span>
            </div>
          </div>

          <Link href={firmware.downloadUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block">
            <Button className="w-full" variant="accent">
              <Download className="mr-2 h-4 w-4" />
              Start Download
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      <div className="max-w-2xl mx-auto">
        <FlashingInstructions brandId={series.brandId} />
      </div>
    </div>
  );
}
