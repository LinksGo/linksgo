'use client'

import { useState } from 'react'
import { Card, CardBody, Button, Progress } from "@nextui-org/react"
import { FaChartLine, FaEye, FaLink, FaUsers } from "react-icons/fa"
import AnalyticsModal from './AnalyticsModal'

export default function Analytics({ links }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState(null)

  // Calculate total clicks across all links
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0)
  
  // Get total number of active links
  const activeLinks = links.filter(link => link.active).length
  
  // Calculate average clicks per link (only for active links)
  const avgClicksPerLink = activeLinks > 0 ? totalClicks / activeLinks : 0
  
  // Find most clicked link
  const mostClickedLink = links.reduce((prev, current) => 
    (prev?.clicks || 0) > (current?.clicks || 0) ? prev : current
  , null)

  // Initialize click history if not present
  links.forEach(link => {
    if (!link.clickHistory) {
      link.clickHistory = [];
      link.last24h = 0;
      link.last7days = 0;
      link.last30days = 0;
    }
  });

  const handleLinkClick = (link) => {
    setSelectedLink(link)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedLink(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <FaChartLine className="text-foreground" />
        Analytics Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clicks Card */}
        <Card className="bg-blue-50 dark:bg-content2">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-lg">
                <FaEye className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 text-foreground">Total Clicks</p>
                <p className="text-2xl font-bold text-blue-600">{totalClicks}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Active Links Card */}
        <Card className="bg-purple-50 dark:bg-content2">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-lg">
                <FaLink className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 text-foreground">Active Links</p>
                <p className="text-2xl font-bold text-purple-600">{activeLinks}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Average Clicks Card */}
        <Card className="bg-green-50 dark:bg-content2">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-lg">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 text-foreground">Avg. Clicks/Link</p>
                <p className="text-2xl font-bold text-green-600">
                  {avgClicksPerLink.toFixed(1)}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Most Clicked Link */}
        <Card className="bg-orange-50 dark:bg-content2">
          <CardBody className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-lg">
                <FaChartLine className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-600 text-foreground">Top Link</p>
                <p className="text-lg font-bold text-orange-600 truncate">
                  {mostClickedLink?.title || 'No links yet'}
                </p>
                <p className="text-sm text-gray-500">
                  {mostClickedLink ? `${mostClickedLink.clicks} clicks` : '0 clicks'}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Link Performance */}
      <Card className="mt-6">
        <CardBody className="p-6">
          <h3 className="text-xl font-semibold mb-6 text-foreground">Link Performance</h3>
          <div className="space-y-6">
            {links.map(link => (
              <div key={link.id} className="space-y-3 pb-6 border-b border-divider last:border-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-foreground text-lg mb-1">{link.title}</h4>
                    <p className="text-sm text-default-500 truncate max-w-[500px]">{link.url}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{link.clicks || 0}</p>
                    <p className="text-sm text-default-500">clicks</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Progress 
                      value={link.clicks || 0}
                      maxValue={Math.max(totalClicks, 1)}
                      size="md"
                      radius="sm"
                      classNames={{
                        base: "w-full dark:bg-content1",
                        indicator: "bg-primary dark:bg-primary",
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="bg-default-100 dark:bg-content2 p-3 rounded-lg">
                    <p className="text-sm text-default-500">Last 24h</p>
                    <p className="text-lg font-semibold text-foreground">
                      {link.last24h || 0}
                    </p>
                  </div>
                  <div className="bg-default-100 dark:bg-content2 p-3 rounded-lg">
                    <p className="text-sm text-default-500">Last 7 days</p>
                    <p className="text-lg font-semibold text-foreground">
                      {link.last7days || 0}
                    </p>
                  </div>
                  <div className="bg-default-100 dark:bg-content2 p-3 rounded-lg">
                    <p className="text-sm text-default-500">Last 30 days</p>
                    <p className="text-lg font-semibold text-foreground">
                      {link.last30days || 0}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {links.length === 0 && (
              <div className="text-center py-8">
                <p className="text-default-500">
                  No links to show analytics for yet
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <AnalyticsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        analytics={selectedLink?.analytics}
      />
    </div>
  )
}
