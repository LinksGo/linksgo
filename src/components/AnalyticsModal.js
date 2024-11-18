'use client'

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react"

export default function AnalyticsModal({ isOpen, onClose, analytics = {} }) {
  if (!isOpen) return null

  const metrics = [
    { label: 'Total Views', value: analytics.totalViews || 0 },
    { label: 'Unique Visitors', value: analytics.uniqueVisitors || 0 },
    { label: 'Average Time on Page', value: analytics.avgTimeOnPage || '0:00' },
    { label: 'Top Referrers', value: analytics.topReferrers?.length || 0 },
  ]

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-background dark:bg-content1",
        header: "border-b border-divider",
        footer: "border-t border-divider",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-xl font-bold text-foreground">
          Analytics Overview
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-content2 dark:bg-content2">
                <CardBody className="p-4">
                  <h3 className="text-sm font-medium text-default-500">
                    {metric.label}
                  </h3>
                  <p className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                {Object.keys(analytics).length === 0 ? (
                  <p className="text-default-600 text-center py-8">
                    Analytics data will appear here as your links receive traffic.
                  </p>
                ) : (
                  <p className="text-default-600 text-center py-8">
                    Recent activity will appear here.
                  </p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="text-lg font-medium mb-3">Popular Links</h3>
                <p className="text-default-600 text-center py-8">
                  Your most clicked links will appear here.
                </p>
              </CardBody>
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onPress={onClose}
            className="dark:hover:bg-content2"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
