

import { searchFirmware } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { Suspense } from 'react';
import { Badge } from '@/components/ui/badge';

function SearchResults({ query }: { query: string }) {
    return <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResultsContent query={query} />
    </Suspense>
}

async function SearchResultsContent({ query }: { query: string }) {
    const results = await searchFirmware(query);

    return (
        <>
            {results.length > 0 ? (
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead className="hidden md:table-cell">Version</TableHead>
                                <TableHead className="hidden sm:table-cell">Android Version</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results.map((firmware) => (
                                <TableRow key={firmware.id}>
                                    <TableCell className="font-medium break-all">{firmware.fileName}</TableCell>
                                    <TableCell className="hidden md:table-cell">{firmware.version}</TableCell>
                                    <TableCell className="hidden sm:table-cell">{firmware.androidVersion}</TableCell>
                                    <TableCell>{firmware.size}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/download/${firmware.id}/ad`}>
                                            <Button variant="accent" size="sm">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download
                                                <Badge variant="secondary" className="ml-2 !text-accent-foreground !bg-accent-foreground/20">Free</Badge>
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-16 border rounded-lg">
                    <p className="text-muted-foreground mb-4">No firmware found for your search.</p>
                </div>
            )}
        </>
    )
}

function SearchResultsSkeleton() {
    return <div className="rounded-lg border p-4 space-y-4">
        <div className="h-10 bg-muted rounded-md animate-pulse"></div>
        <div className="space-y-2">
            <div className="h-8 bg-muted rounded-md animate-pulse"></div>
            <div className="h-8 bg-muted rounded-md animate-pulse"></div>
            <div className="h-8 bg-muted rounded-md animate-pulse"></div>
        </div>
    </div>
}

export default function SearchPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
    const query = typeof searchParams?.q === 'string' ? searchParams.q : '';

    return (
        <>
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                <p className="text-muted-foreground mb-8">
                    Showing results for: <span className="font-semibold">{query}</span>
                </p>
                <SearchResults query={query} />
            </div>
        </>
    );
}
