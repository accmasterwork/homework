'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 mr-3" />
            Terms of Service
          </h1>
          <p className="text-muted-foreground mt-2">
            Last updated: November 30, 2024
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using the Open Source Project Manager platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Open Source Project Manager is a comprehensive platform designed to help developers and organizations manage open-source projects. The Service includes project management tools, collaboration features, documentation management, and community engagement capabilities.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. User Accounts</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    To access certain features of the Service, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Provide accurate, current, and complete information during registration</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password and account</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use of your account</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    You agree not to use the Service to:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>Upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, or otherwise objectionable</li>
                    <li>Impersonate any person or entity or falsely state your affiliation with any person or entity</li>
                    <li>Upload, post, or transmit any content that infringes any patent, trademark, trade secret, copyright, or other proprietary rights</li>
                    <li>Upload, post, or transmit any unsolicited or unauthorized advertising, promotional materials, or spam</li>
                    <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                    <li>Attempt to gain unauthorized access to any portion of the Service</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Content and Intellectual Property</h2>
                <div className="space-y-3">
                  <p className="text-muted-foreground leading-relaxed">
                    You retain ownership of any content you submit, post, or display on the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    The Service and its original content, features, and functionality are owned by Open Source Project Manager and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Disclaimer</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions, and terms whether express or implied.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall Open Source Project Manager, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which the Service operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">12. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-muted/50 p-4 rounded-lg mt-3">
                  <p className="text-foreground font-medium">Open Source Project Manager</p>
                  <p className="text-muted-foreground">Email: legal@your-domain.com</p>
                  <p className="text-muted-foreground">Address: Your Business Address</p>
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
