'use client'

import { useState } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react"
import { FaLink, FaDownload } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

export default function QRCodeModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      
      // Validate URL
      try {
        new URL(url)
      } catch (e) {
        throw new Error('Please enter a valid URL')
      }

      // Use QR Server API to generate QR code
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
      setQrUrl(apiUrl)
      toast.success('QR code generated successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to generate QR code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'qrcode.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      toast.success('QR code downloaded!')
    } catch (error) {
      console.error('Failed to download:', error)
      toast.error('Failed to download QR code')
    }
  }

  const handleClose = () => {
    setUrl('')
    setQrUrl('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Generate QR Code
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Enter URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              startContent={<FaLink className="text-default-400" />}
              type="url"
            />
            {qrUrl && (
              <div className="flex flex-col items-center gap-4">
                <img 
                  src={qrUrl} 
                  alt="Generated QR Code"
                  className="border border-divider rounded-lg p-2 bg-white"
                />
                <Button
                  color="primary"
                  variant="flat"
                  onPress={handleDownload}
                  startContent={<FaDownload />}
                >
                  Download QR Code
                </Button>
              </div>
            )}
            <div className="rounded-lg bg-default-50 dark:bg-content2 p-4 text-sm text-default-600">
              <p className="mb-2">
                <strong>Note:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>QR codes are generated using the QR Server API</li>
                <li>Generated QR codes are not stored in your profile</li>
                <li>The service is free and doesn't require authentication</li>
                <li>QR codes can be downloaded as PNG images</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Close
          </Button>
          <Button 
            color="primary" 
            onPress={handleGenerate}
            isLoading={isLoading}
            isDisabled={!url || isLoading}
          >
            Generate QR Code
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
