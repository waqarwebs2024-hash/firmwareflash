import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/components/main-layout";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <MainLayout>
        <div className="container mx-auto py-12 px-4">
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 prose prose-lg dark:prose-invert max-w-none">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                
                <p>
                    Your privacy is important to us. It is Firmware Finder's policy to
                    respect your privacy regarding any information we may collect from
                    you across our website, <Link href="/">https://firmware-finder-app.com</Link>, and other sites we own and operate.
                </p>

                <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                <p>
                    We only ask for personal information when we truly need it to provide
                    a service to you. We collect it by fair and lawful means, with your
                    knowledge and consent. We also let you know why we’re collecting it
                    and how it will be used.
                </p>
                <h3>Log Data</h3>
                <p>
                    Like most website operators, we collect information that your browser sends
                    whenever you visit our site ("Log Data"). This Log Data may include information such as
                    your computer's Internet Protocol ("IP") address, browser type, browser version,
                    the pages of our site that you visit, the time and date of your visit, the
                    time spent on those pages, and other statistics.
                </p>
                <h3>Personal Information</h3>
                <p>
                    We may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to, your name and email address when you use our contact form.
                </p>

                <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
                <p>
                    We use the information we collect to:
                </p>
                <ul>
                    <li>Provide, operate, and maintain our website.</li>
                    <li>Improve, personalize, and expand our website.</li>
                    <li>Understand and analyze how you use our website.</li>
                    <li>Develop new products, services, features, and functionality.</li>
                    <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
                    <li>Send you emails in response to your inquiries.</li>
                    <li>Find and prevent fraud.</li>
                </ul>

                <h2 className="text-2xl font-semibold">3. Cookies and Web Beacons</h2>
                <p>
                    Like any other website, Firmware Finder uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                </p>

                <h2 className="text-2xl font-semibold">4. Google AdSense and DoubleClick DART Cookie</h2>
                <p>
                    We may use Google AdSense to serve advertisements on our site. Google is a third-party vendor that uses cookies to serve ads. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our sites and other sites on the Internet. Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>.
                </p>
                <p>
                    Our advertising partners may also use cookies and web beacons. Our advertising partners are listed below:
                </p>
                <ul>
                    <li>Google</li>
                </ul>

                <h2 className="text-2xl font-semibold">5. Security</h2>
                <p>
                    We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
                </p>
                <p>
                    The security of your personal information is important to us, but
                    remember that no method of transmission over the Internet, or method of
                    electronic storage, is 100% secure. While we strive to use
                    commercially acceptable means to protect your personal information,
                    we cannot guarantee its absolute security.
                </p>
                
                <h2 className="text-2xl font-semibold">6. Links to Other Sites</h2>
                <p>
                    Our website may contain links to other sites that are not operated by us.
                    If you click on a third party link, you will be directed to that third party's
                    site. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services. We strongly advise you to review the Privacy Policy of every site you visit.
                </p>
                
                <h2 className="text-2xl font-semibold">7. Children's Information</h2>
                <p>
                    Our website does not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
                </p>

                <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
                <p>
                    We may update our Privacy Policy from time to time. We will notify you
                    of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
                
                <h2 className="text-2xl font-semibold">Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, you can contact us through our <Link href="/contact">contact page</Link>.
                </p>
            </CardContent>
        </Card>
        </div>
    </MainLayout>
  );
}
