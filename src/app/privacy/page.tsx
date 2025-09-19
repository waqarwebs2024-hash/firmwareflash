import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-lg dark:prose-invert max-w-none">
          <p>
            Your privacy is important to us. It is Firmware Finder's policy to
            respect your privacy regarding any information we may collect from
            you across our website.
          </p>

          <h2 className="text-2xl font-semibold">1. Information we collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide
            a service to you. We collect it by fair and lawful means, with your
            knowledge and consent. We also let you know why we’re collecting it
            and how it will be used.
          </p>
          <p>
            The only personal information we collect is what you voluntarily provide
            to us through our contact form (such as your name and email address).
          </p>

          <h2 className="text-2xl font-semibold">2. How we use your information</h2>
          <p>
            We may use the information we collect to:
          </p>
          <ul>
            <li>Respond to your inquiries and support requests.</li>
            <li>Improve our website and services.</li>
            <li>Send you technical notices, updates, and security alerts.</li>
          </ul>

          <h2 className="text-2xl font-semibold">3. Log Data</h2>
          <p>
            Like most website operators, we collect information that your browser sends
            whenever you visit our site. This Log Data may include information such as
            your computer's Internet Protocol ("IP") address, browser type, browser version,
            the pages of our site that you visit, the time and date of your visit, the
            time spent on those pages, and other statistics.
          </p>

          <h2 className="text-2xl font-semibold">4. Cookies</h2>
            <p>
                We use cookies to store information about your preferences and to record user-specific
                information on which pages you access or visit.
            </p>

          <h2 className="text-2xl font-semibold">5. Security</h2>
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
            site. We strongly advise you to review the Privacy Policy of every site you visit.
          </p>

          <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you
            of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>This policy is effective as of {new Date().getFullYear()}.</p>
        </CardContent>
      </Card>
    </div>
  );
}
