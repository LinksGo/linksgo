'use client'

import {
  Card,
  CardBody,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Link,
  Divider,
  Code,
} from "@nextui-org/react"
import { FaGithub, FaEnvelope } from 'react-icons/fa'
import ThemeLogo from '@/components/ThemeLogo'

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-5 mb-6">
          <ThemeLogo width={64} height={64} className="drop-shadow-md" />
          <h1 className="text-4xl font-bold text-primary">LinksGo Documentation</h1>
        </div>
        <p className="text-large text-default-600">
          Complete guide to using LinksGo's features and capabilities.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <Tabs 
          aria-label="Documentation sections"
          color="primary"
          variant="underlined"
          classNames={{
            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary"
          }}
        >
          {/* Getting Started */}
          <Tab key="getting-started" title="Getting Started">
            <Card className="mt-4">
              <CardBody className="gap-4">
                <h2 className="text-2xl font-bold text-foreground">Welcome to LinksGo</h2>
                <p className="text-default-600">
                  LinksGo is your all-in-one platform for managing, sharing, and tracking your digital links.
                  Here's everything you need to know to get started.
                </p>

                <Accordion variant="bordered">
                  <AccordionItem key="1" title="Quick Start Guide">
                    <div className="space-y-4">
                      <h3 className="font-semibold">1. Create Your Account</h3>
                      <p>Sign up using your email or social media accounts.</p>
                      
                      <h3 className="font-semibold">2. Set Up Your Profile</h3>
                      <p>Customize your profile with your name, username, and avatar.</p>
                      
                      <h3 className="font-semibold">3. Add Your First Link</h3>
                      <p>Click the "Add New Link" button and enter your link details.</p>
                    </div>
                  </AccordionItem>

                  <AccordionItem key="2" title="Dashboard Overview">
                    <div className="space-y-4">
                      <p>Your dashboard provides quick access to all LinksGo features:</p>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Link Management</li>
                        <li>Link Shortening</li>
                        <li>QR Code Generation</li>
                        <li>Analytics</li>
                        <li>Profile Settings</li>
                      </ul>
                    </div>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </Tab>

          {/* Features */}
          <Tab key="features" title="Features">
            <Card className="mt-4">
              <CardBody className="gap-4">
                <Accordion variant="bordered">
                  <AccordionItem key="1" title="Link Management">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Creating Links</h3>
                      <p>Add new links with custom titles and descriptions.</p>
                      
                      <h3 className="font-semibold">Organizing Links</h3>
                      <p>Sort and manage your links efficiently from the dashboard.</p>
                    </div>
                  </AccordionItem>

                  <AccordionItem key="2" title="Link Shortening">
                    <div className="space-y-4">
                      <h3 className="font-semibold">How to Shorten Links</h3>
                      <p>Use our TinyURL integration to create shortened versions of your links.</p>
                      
                      <h3 className="font-semibold">Usage Limits</h3>
                      <p>Links are shortened using the free TinyURL API service.</p>
                    </div>
                  </AccordionItem>

                  <AccordionItem key="3" title="QR Code Generation">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Creating QR Codes</h3>
                      <p>Generate QR codes for any link with our QR Server API integration.</p>
                      
                      <h3 className="font-semibold">Downloading QR Codes</h3>
                      <p>Download your QR codes in PNG format for use in your materials.</p>
                    </div>
                  </AccordionItem>

                  <AccordionItem key="4" title="Analytics">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Link Performance</h3>
                      <p>Track clicks and engagement for your links.</p>
                      
                      <h3 className="font-semibold">Time-Based Metrics</h3>
                      <p>View performance over 24 hours, 7 days, and 30 days.</p>
                    </div>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </Tab>

          {/* API Documentation */}
          <Tab key="api" title="API">
            <Card className="mt-4">
              <CardBody className="gap-4">
                <h2 className="text-2xl font-bold text-foreground">API Documentation</h2>
                <p className="text-default-600">
                  LinksGo uses the following external APIs:
                </p>

                <Accordion variant="bordered">
                  <AccordionItem key="1" title="TinyURL API">
                    <div className="space-y-4">
                      <p>Used for link shortening:</p>
                      <Code>
                        https://tinyurl.com/api-create.php?url=YOUR_URL
                      </Code>
                    </div>
                  </AccordionItem>

                  <AccordionItem key="2" title="QR Server API">
                    <div className="space-y-4">
                      <p>Used for QR code generation:</p>
                      <Code>
                        https://api.qrserver.com/v1/create-qr-code/?data=YOUR_DATA
                      </Code>
                    </div>
                  </AccordionItem>
                </Accordion>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-divider">
        <div className="flex justify-between items-center">
          <div className="text-default-600">
            <p>Need more help? Contact us:</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="https://github.com/Retr0-XD"
              target="_blank"
              className="text-default-600 hover:text-primary"
            >
              <FaGithub size={24} />
            </Link>
            <Link
              href="mailto:retr0secanddev@gmail.com"
              className="text-default-600 hover:text-primary"
            >
              <FaEnvelope size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
