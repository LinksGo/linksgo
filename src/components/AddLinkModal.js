'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@nextui-org/react"
import { FaPlus } from 'react-icons/fa'
import useUserStore from '@/store/userStore'

export default function AddLinkModal({ isOpen, onClose }) {
  const { userData, addLink } = useUserStore()
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: ''
  })
  const [errors, setErrors] = useState({})

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        url: '',
        description: ''
      })
      setErrors({})
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else if (!/^https?:\/\/.+/.test(formData.url)) {
      newErrors.url = 'Please enter a valid URL starting with http:// or https://'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      const newLink = {
        id: Date.now(),
        ...formData,
        userId: userData.id,
        createdAt: new Date(),
        clicks: 0,
        active: true
      }
      addLink(newLink)
      setFormData({ title: '', url: '', description: '' })
      onClose()
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.2,
              ease: "easeOut"
            }
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.15,
              ease: "easeIn"
            }
          }
        }
      }}
      classNames={{
        base: "max-w-md",
        backdrop: "bg-black/50 backdrop-blur-sm",
        body: "p-6",
        header: "p-6 border-b border-divider",
        footer: "p-6 border-t border-divider",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground">Add New Link</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-default-500 dark:text-default-400 font-medium block">
                Title
              </label>
              <Input
                placeholder="Enter link title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                size="lg"
                classNames={{
                  input: "h-12 bg-background dark:bg-content2",
                  innerWrapper: "bg-transparent",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-default-500 dark:text-default-400 font-medium block">
                URL
              </label>
              <Input
                placeholder="Enter URL"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                size="lg"
                classNames={{
                  input: "h-12 bg-background dark:bg-content2",
                  innerWrapper: "bg-transparent",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-default-500 dark:text-default-400 font-medium block">
                Description
              </label>
              <Textarea
                placeholder="Enter link description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                size="lg"
                minRows={2}
                maxRows={3}
                classNames={{
                  input: "bg-background dark:bg-content2",
                  innerWrapper: "bg-transparent",
                }}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="p-6">
          <div className="flex gap-4 w-full justify-end">
            <Button
              variant="flat"
              onPress={onClose}
              className="font-semibold bg-default-100 dark:bg-content2 text-default-700 dark:text-default-500 hover:bg-default-200 dark:hover:bg-content3"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="solid"
              onPress={handleSubmit}
              startContent={<FaPlus />}
              className="font-semibold bg-primary-500 hover:bg-primary-600"
            >
              Add Link
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
