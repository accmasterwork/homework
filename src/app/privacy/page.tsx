'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Shield className="h-8 w-8 mr-3" />
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-2">
            Last updated: November 30, 2024
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Open Source Project Manager ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Personal Information</h3>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      We may collect personal information that you voluntarily provide to us, including:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Name and email address</li>
                      <li>Profile information and avatar</li>
                      <li>GitHub username and profile data (if connected)</li>
                      <li>Project information and content you create</li>
                      <li>Communications and support requests</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Usage Information</h3>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      We automatically collect certain information about your use of our service:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                      <li>Log data (IP address, browser type, pages visited)</li>
                      <li>Device information and operating system</li>
                      <li>Usage patterns and feature interactions</li>
                      <li>Performance and error data</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Cookies and Tracking</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and provide personalized content.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and manage your account</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Analyze usage patterns to improve user experience</li>
                    <li>Detect, prevent, and address technical issues and security threats</li>
                    <li>Comply with legal obligations and enforce our terms</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Information Sharing and Disclosure</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Service Providers</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We may share information with trusted third-party service providers who assist us in operating our platform, conducting business, or serving users.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Legal Requirements</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We may disclose information if required by law, court order, or government request, or to protect our rights, property, or safety.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Business Transfers</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the transaction.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights and Choices</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Delete your personal information</li>
                    <li>Restrict or object to processing of your information</li>
                    <li>Data portability (receive a copy of your data)</li>
                    <li>Withdraw consent where processing is based on consent</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Third-Party Integrations</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our platform may integrate with third-party services (such as GitHub). These integrations are governed by the privacy policies of those third parties. We encourage you to review their privacy policies before connecting your accounts.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. International Data Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg mt-3">
                  <p className="text-foreground font-medium">Open Source Project Manager</p>
                  <p className="text-muted-foreground">Email: privacy@your-domain.com</p>
                  <p className="text-muted-foreground">Address: Your Business Address</p>
                  <p className="text-muted-foreground">Data Protection Officer: dpo@your-domain.com</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
