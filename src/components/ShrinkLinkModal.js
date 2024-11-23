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
  Link,
} from "@nextui-org/react"
import { FaCopy, FaLink, FaExternalLinkAlt } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

export default function ShrinkLinkModal({ isOpen, onClose }) {
  const [url, setUrl] = useState('')
  const [shortUrl, setShortUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleShrink = async () => {
    try {
      setIsLoading(true)
      
      // Validate URL
      try {
        new URL(url)
      } catch (e) {
        throw new Error('Please enter a valid URL')
      }

      // Use TinyURL API to shorten the URL
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`)
      if (!response.ok) {
        throw new Error('Failed to shorten URL')
      }

      const shortenedUrl = await response.text()
      setShortUrl(shortenedUrl)
      toast.success('Link shortened successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Failed to shrink link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy link')
    }
  }

  const handleClose = () => {
    setUrl('')
    setShortUrl('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Shrink Link
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Enter URL"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              startContent={<FaLink className="text-default-400" />}
              type="url"
            />
            {shortUrl && (
              <div className="flex items-center gap-2">
                <Input
                  label="Shortened URL"
                  value={shortUrl}
                  readOnly
                  className="flex-grow"
                />
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  onPress={handleCopy}
                >
                  <FaCopy />
                </Button>
              </div>
            )}
            <div className="rounded-lg bg-default-50 dark:bg-content2 p-4 text-sm text-default-600">
              <p className="mb-2">
                <strong>Disclaimer:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>This service uses TinyURL for link shortening</li>
                <li>Shortened links are not stored in your profile</li>
                <li>We don't track or monitor shortened URLs</li>
                <li>Please review TinyURL's terms of service for link expiration and usage policies</li>
              </ul>
              <div className="mt-3">
                <Link
                  href="https://tinyurl.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary flex items-center gap-1 text-sm"
                >
                  TinyURL Terms of Service <FaExternalLinkAlt className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleClose}>
            Close
          </Button>
          <Button 
            color="primary" 
            onPress={handleShrink}
            isLoading={isLoading}
            isDisabled={!url || isLoading}
          >
            Shrink Link
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
