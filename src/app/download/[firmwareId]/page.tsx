

import { getFirmwareById, getBrandById, getSeriesById, getFlashingInstructionsFromDB, saveFlashingInstructionsToDB, getOrCreateTool, incrementDownloadCount, getAdSettings } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, HardDrive, Calendar, Users, AlertTriangle, FileText, ChevronsRight, Package, Info, ListChecks, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { getFlashingInstructions, FlashingInstructionsOutput } from '@/ai/flows/get-flashing-instructions-flow';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Metadata, ResolvingMetadata } from 'next';
import { FaqSection } from '@/components/faq-section';
import { RelatedFirmware } from '@/components/related-firmware';
import { HowTo, WithContext } from 'schema-dts';
import { Badge } from '@/components/ui/badge';
import { use } from 'react';


type Props = {
  params: { firmwareId: string }
}

export async function generateMetadata(
  { params: promiseParams }: Props,
): Promise<Metadata> {
  const params = await promiseParams;
  const firmware = await getFirmwareById(params.firmwareId);
  if (!firmware) return { title: "Firmware Not Found" };

  const series = await getSeriesById(firmware.seriesId);
  if (!series) return { title: "Firmware Not Found" };
  
  const brand = await getBrandById(series.brandId);
  if (!brand) return { title: "Brand Not Found" };

  const pageTitle = `Download ${brand.name} ${series.name} Firmware (Flash File) - ${firmware.version}`;
  const pageDescription = `Download ${brand.name} ${series.name} ${firmware.version} firmware (flash file). Official stock ROM with Flash Tool, USB Driver, and step-by-step installation guide.`;
 
  return {
    title: pageTitle,
    description: pageDescription,
  }
}

async function FlashingInstructions({ brandId, seriesName, instructionsData }: { brandId: string, seriesName: string, instructionsData: FlashingInstructionsOutput | null }) {
  const brand = await getBrandById(brandId);
  if (!brand) return null;
  
  if (!instructionsData) {
    return (
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <FileText className="mr-3 h-6 w-6" />
                How to Flash {seriesName} Firmware (Step-by-Step)
            </h2>
            <p className="text-muted-foreground">Could not load flashing instructions at this time.</p>
        </section>
    )
  }

  const { introduction, prerequisites, instructions, warning, tool } = instructionsData;
  
  const howToSchema: WithContext<HowTo> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Flash ${seriesName} Firmware (Stock ROM)`,
    "description": introduction,
    "step": instructions.map((step, index) => ({
      "@type": "HowToStep",
      "name": step.title,
      "text": step.description,
      "position": index + 1,
    })),
    "tool": prerequisites.map(item => ({ "@type": "HowToTool", "name": item })),
    "totalTime": "PT30M", // Estimated time: 30 minutes
  };


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
    <section id="flashing-guide" className="mb-8 scroll-mt-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-4">How to Flash {seriesName} Stock ROM & Firmware [Step-by-Step]</h2>
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
                            <AccordionContent className="text-muted-foreground space-y-2">
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

async function FlashingInstructionsFetcher({ brandId, brandName, seriesName }: { brandId: string, brandName: string, seriesName: string }) {
    let instructionsData = await getFlashingInstructionsFromDB(brandId);
    
    if (!instructionsData) {
        try {
            const generatedInstructions = await getFlashingInstructions({ brandName: brandName });
            if (generatedInstructions?.tool) {
                await getOrCreateTool(generatedInstructions.tool.slug, generatedInstructions.tool.name);
            }
            if (generatedInstructions) {
                await saveFlashingInstructionsToDB(brandId, generatedInstructions);
            }
            instructionsData = generatedInstructions;
        } catch (error) {
            console.error("Failed to generate or save flashing instructions:", error);
            instructionsData = null;
        }
    }
    
    return <FlashingInstructions brandId={brandId} seriesName={seriesName} instructionsData={instructionsData} />
}


export default async function DownloadPage({ params }: Props) {
  const firmware = await getFirmwareById(params.firmwareId);
  const adSettings = await getAdSettings();
  
  if (!firmware) notFound();

  const series = await getSeriesById(firmware.seriesId);
  if (!series) notFound();

  const brand = await getBrandById(series.brandId);
  if (!brand) notFound();

  const { fileName, version, androidVersion, size, uploadDate, downloadCount } = firmware;

  const date = uploadDate?.toDate ? uploadDate.toDate() : new Date();

  const inContentAd = adSettings.slots?.inContent;

  const faqItems = [
    {
        question: `Is this ${series.name} firmware official?`,
        answer: `Yes, every stock rom download for the ${series.name} on our site is the official software released by ${brand.name}. It is not a custom ROM and is intended to restore your device to its original state. The flash file is original and untouched.`
    },
    {
        question: `Can I use this stock ROM to unbrick my ${series.name}?`,
        answer: `Absolutely. A common reason for a stock rom download is to fix a soft-bricked device (e.g., stuck in a bootloop). Following the flashing instructions carefully with the correct firmware can restore your phone to working condition.`
    },
    {
        question: `Is the ${series.name} stock rom and flash file download free?`,
        answer: "Yes, all firmware files and flash tools provided on firmwareflash.com are free to download. We believe in providing open access to help users repair their devices."
    },
    {
        question: `Can I downgrade my ${series.name} firmware?`,
        answer: "Downgrading firmware can be risky and may not always be possible due to security restrictions. We recommend you only proceed with a stock rom download for downgrading if you are an advanced user and understand the risks of using an older flash file."
    }
  ]
  
  const tocItems = [
    { href: '#flashing-guide', label: 'Flashing Guide', icon: FileText },
    { href: '#download-info', label: 'Download Info', icon: Download },
    { href: '#faqs', label: 'FAQs', icon: HelpCircle },
    { href: '#related-firmware', label: 'Related Firmware', icon: ListChecks },
  ];

  return (
    <>
      <main className="container mx-auto py-12 px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {brand.name} {series.name} Firmware Download (Flash File)
        </h1>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronsRight className="h-4 w-4" />
          <Link href={`/brand/${brand.id}`} className="hover:text-primary">{brand.name} Firmware</Link>
          <ChevronsRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{series.name}</span>
        </div>

        <Card className="mb-8">
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {tocItems.map((item) => (
              <Link href={item.href} key={item.href}>
                <div className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors">
                  <item.icon className="mx-auto h-6 w-6 mb-2 text-primary" />
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>


        <FlashingInstructionsFetcher brandId={brand.id} brandName={brand.name} seriesName={series.name} />

        {inContentAd?.enabled && inContentAd.adCode && (
          <div className="my-8 flex justify-center">
            <div dangerouslySetInnerHTML={{ __html: inContentAd.adCode }} />
          </div>
        )}

        <section id="download-info" className="bg-card border shadow-sm rounded-xl mt-12 scroll-mt-20">
          <div className="p-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">{brand.name} {series.name} Firmware Details</h2>
              <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start">
                      <Package className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                      <div>
                          <h3 className="font-semibold text-foreground">Flash File Name</h3>
                          <p className="break-all">{fileName}</p>
                      </div>
                  </div>
                  <div className="flex items-start">
                      <Info className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                      <div>
                          <h3 className="font-semibold text-foreground">Version</h3>
                          <p>{version} / Android {androidVersion}</p>
                      </div>
                  </div>
                  <div className="flex items-start">
                      <HardDrive className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                      <div>
                          <h3 className="font-semibold text-foreground">Firmware Size</h3>
                          <p>{size}</p>
                      </div>
                  </div>
                  <div className="flex items-start">
                      <Calendar className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                      <div>
                          <h3 className="font-semibold text-foreground">Upload Date</h3>
                          <p>{format(date, 'PPP')}</p>
                      </div>
                  </div>
                  <div className="flex items-start">
                      <Users className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" />
                      <div>
                          <h3 className="font-semibold text-foreground">Downloads</h3>
                          <p>{downloadCount.toLocaleString()}</p>                      </div>
                  </div>
              </div>
          </div>
          <div className="bg-muted/50 p-6 rounded-b-xl">
              <Link href={firmware.downloadUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full animated-button" variant="primary" size="lg">
                  <Download className="mr-2 h-5 w-5" />
                  Start Firmware Download
                  <Badge variant="accent" className="ml-2">Free</Badge>
                  </Button>
              </Link>
          </div>
        </section>

        <FaqSection title={`FAQs About ${series.name} Firmware & Flash File`} items={faqItems} id="faqs" />

        <RelatedFirmware brandId={brand.id} seriesId={series.id} id="related-firmware" />
      </main>
    </>
  );
}

