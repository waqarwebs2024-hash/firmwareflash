
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Metadata } from 'next';

// Note: Metadata can't be dynamically generated in a 'use client' component directly.
// This is a static placeholder. For dynamic titles, this would need a different approach.
// export const metadata: Metadata = {
//   title: 'Disclaimer - Firmware Finder',
//   description: 'Important legal disclaimer for the use of Firmware Finder. Understand the risks associated with downloading and installing firmware.',
// };

export default function DisclaimerPage() {
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <>
        <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
            <CardTitle className="text-3xl font-bold">Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 prose prose-lg dark:prose-invert max-w-none">
                <p><strong>Last Updated:</strong> {lastUpdated}</p>
                
                <h2 className="text-2xl font-semibold">General Information</h2>
                <p>
                    The information provided by Firmware Finder ("we," "us," or "our") on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
                </p>

                <h2 className="text-2xl font-semibold">Firmware and Software Disclaimer</h2>
                <p>
                    All firmware, software, and guides available on this website are provided on an "as is" basis. Flashing firmware or modifying your device's software carries inherent risks. These risks include, but are not limited to:
                </p>
                <ul>
                    <li><strong>Bricking your device:</strong> The process may render your device permanently unusable.</li>
                    <li><strong>Voiding your warranty:</strong> Manufacturers may void your device’s warranty if you install unofficial software or modify the existing software.</li>
                    <li><strong>Data loss:</strong> The flashing process typically erases all user data on the device. You are solely responsible for backing up your personal data before proceeding.</li>
                    <li><strong>Security vulnerabilities:</strong> Using modified or incorrect firmware could expose your device to security risks.</li>
                </ul>
                <p>
                    By downloading and using any file or guide from this website, you acknowledge and agree that you are doing so at your own risk. We shall not be held responsible or liable for any damage, data loss, or any other issues that may arise to your device as a result of following the tutorials or using the files provided on this website.
                </p>

                <h2 className="text-2xl font-semibold">Trademarks and Logos Disclaimer</h2>
                <p>
                    All trademarks, service marks, trade names, trade dress, product names, and logos appearing on the site are the property of their respective owners. Samsung, Apple, Huawei, Xiaomi, and any other brand names are the trademarks of their respective holders. Firmware Finder is not affiliated with, endorsed by, or in any way officially connected with these companies. The use of any trade name or trademark is for identification and reference purposes only and does not imply any association with the trademark holder of their product brand.
                </p>

                <h2 className="text-2xl font-semibold">External Links Disclaimer</h2>
                <p>
                    The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
                </p>
                
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p>
                    If you have any questions about this Disclaimer, you can contact us through our <Link href="/contact">contact page</Link>.
                </p>
            </CardContent>
        </Card>
        </div>
    </>
  );
}
