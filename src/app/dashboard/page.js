'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddLinkModal from '@/components/AddLinkModal'
import ProfileSettingsModal from '@/components/ProfileSettingsModal'
import ShrinkLinkModal from '@/components/ShrinkLinkModal'
import QRCodeModal from '@/components/QRCodeModal'
import Analytics from '@/components/Analytics'
import useUserStore from '@/store/userStore'
import { themes } from '@/config/themes'
import {
  Card,
  CardBody,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  useDisclosure,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  User,
  Select,
  SelectItem,
} from "@nextui-org/react"
import { 
  FaPlus, 
  FaGlobe, 
  FaCog, 
  FaSignOutAlt, 
  FaUserCog, 
  FaTrash, 
  FaLightbulb, 
  FaBug, 
  FaGithub, 
  FaPalette, 
  FaHourglassHalf, 
  FaChartLine, 
  FaLink, 
  FaCompressArrowsAlt, 
  FaQrcode, 
  FaBolt,
  FaLinkedin,
  FaMusic,
  FaBook,
  FaBomb,
  FaBars
} from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import ThemeLogo from '@/components/ThemeLogo'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { userData, updateUserData } = useUserStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isShrinkModalOpen, setIsShrinkModalOpen] = useState(false)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)
  const [initialOneTime, setInitialOneTime] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    // Handle Quick Action parameters
    const action = searchParams.get('action')
    if (action === 'newLink' || action === 'newOneTimeLink') {
      setInitialOneTime(action === 'newOneTimeLink')
      setIsAddModalOpen(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (session?.user && !userData.initialized) {
      updateUserData({
        name: session.user.name || '',
        username: session.user.username || '',
        image: session.user.image || '',
        initialized: true
      })
    }
  }, [session, userData.initialized])

  const getProfileImage = () => {
    return session?.user?.image || userData?.image || '/default-avatar.png'
  }

  const handleViewPublicPage = () => {
    if (!userData?.username || !userData?.name) {
      toast.error('Please complete your profile settings first to view your public page', {
        duration: 4000,
        position: 'bottom-center',
      })
      setIsProfileModalOpen(true)
      return
    }
    router.push(`/${userData.username}`)
  }

  const handleFeatureRequest = () => {
    const subject = encodeURIComponent('LinksGo Feature Request')
    const body = encodeURIComponent(`Hi,

I'd like to request a new feature for LinksGo:

Feature Description:
[Please describe the feature you'd like to see]

Why this feature would be useful:
[Please explain why this feature would be valuable]

Username: ${userData.username || 'Not set'}
Name: ${userData.name || 'Not set'}

Best regards,
${userData.name || 'A LinksGo User'}`)

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=retr0secanddev@gmail.com&su=${subject}&body=${body}`, '_blank')
    toast.success('Opening Gmail...', { duration: 2000 })
  }

  const handleReportBug = () => {
    const subject = encodeURIComponent('LinksGo Bug Report')
    const body = encodeURIComponent(`Hi,

I'd like to report a bug in LinksGo:

Bug Description:
[Please describe what's not working]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [And so on...]

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happens]

Username: ${userData.username || 'Not set'}
Name: ${userData.name || 'Not set'}

Best regards,
${userData.name || 'A LinksGo User'}`)

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=retr0secanddev@gmail.com&su=${subject}&body=${body}`, '_blank')
    toast.success('Opening Gmail...', { duration: 2000 })
  }

  const handleGithubIssue = () => {
    window.open('https://github.com/LinksGo/linksgo/issues', '_blank')
    toast.success('Opening GitHub issues...', { duration: 2000 })
  }

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion
    toast.error('This feature is coming soon!', { duration: 2000 })
  }

  if (status === 'loading' || !userData?.initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-b-2 border-primary-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-content1">
      {/* Navigation Bar */}
      <Navbar 
        className="shadow-sm bg-background dark:bg-content1 border-b border-divider"
        maxWidth="full"
        isBordered
      >
        <NavbarBrand className="gap-3">
          <ThemeLogo width={40} height={40} className="sm:w-12 sm:h-12" />
          <p className="font-bold text-lg sm:text-xl text-foreground">LinksGo</p>
        </NavbarBrand>
        <NavbarContent justify="end" className="hidden sm:flex">
          <NavbarItem>
            <Button
              color="primary"
              variant="solid"
              size="lg"
              onPress={() => setIsAddModalOpen(true)}
              startContent={<FaPlus />}
              className="font-semibold bg-green-600 hover:bg-green-700 text-white"
            >
              Add Link
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Tooltip 
              content={!userData?.username || !userData?.name ? "Complete your profile first" : "View your public page"}
              placement="bottom"
              delay={0}
              classNames={{
                content: "text-foreground bg-background dark:bg-content2",
              }}
            >
              <Button
                color="secondary"
                variant="solid"
                size="lg"
                onPress={() => {
                  if (!userData?.username || !userData?.name) {
                    toast.error('Please complete your profile first')
                    setIsProfileModalOpen(true)
                    return
                  }
                  router.push(`/${userData.username}`)
                }}
                startContent={<FaGlobe />}
                className="font-semibold bg-purple-600 hover:bg-purple-700 text-white"
              >
                View Public Page
              </Button>
            </Tooltip>
          </NavbarItem>
          <NavbarItem>
            <Dropdown>
              <DropdownTrigger>
                <div className="flex items-center gap-2">
                  <Avatar
                    isBordered
                    src={getProfileImage()}
                    size="sm"
                    className="w-8 h-8 cursor-pointer"
                    showFallback
                    fallback={
                      <div className="w-8 h-8 bg-default-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-default-500">
                          {userData?.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>
                    }
                  />
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-sm font-medium">{userData.name || 'Set name'}</span>
                    <span className="text-xs text-default-500">
                      {userData.username ? `@${userData.username}` : 'Set username'}
                    </span>
                  </div>
                </div>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Settings Actions"
                className="text-foreground"
                variant="flat"
              >
                <DropdownItem
                  key="profile"
                  startContent={<FaUserCog className="text-default-500" />}
                  description="Update your profile information"
                  onPress={() => setIsProfileModalOpen(true)}
                >
                  Edit Profile
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger"
                  color="danger"
                  startContent={<FaSignOutAlt className="text-danger" />}
                  onPress={() => signOut()}
                >
                  Sign Out
                </DropdownItem>
                <DropdownItem
                  key="feature"
                  startContent={<FaLightbulb className="text-default-500" />}
                  description="Suggest a new feature"
                  onPress={handleFeatureRequest}
                >
                  Request Feature
                </DropdownItem>
                <DropdownItem
                  key="bug"
                  startContent={<FaBug className="text-default-500" />}
                  description="Report a bug via email"
                  onPress={handleReportBug}
                >
                  Report Bug
                </DropdownItem>
                <DropdownItem
                  key="github"
                  startContent={<FaGithub className="text-default-500" />}
                  description="Create an issue on GitHub"
                  onPress={handleGithubIssue}
                >
                  Raise GitHub Issue
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<FaTrash className="text-danger" />}
                  onPress={handleDeleteAccount}
                >
                  Delete Account
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
        {/* Mobile Menu */}
        <NavbarContent justify="end" className="sm:hidden">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                src={getProfileImage()}
                size="sm"
                className="w-8 h-8 cursor-pointer"
                showFallback
                fallback={
                  <div className="w-8 h-8 bg-default-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-default-500">
                      {userData?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                }
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Mobile navigation">
              <DropdownItem
                key="add"
                startContent={<FaPlus />}
                onPress={() => setIsAddModalOpen(true)}
              >
                Add Link
              </DropdownItem>
              <DropdownItem
                key="public"
                startContent={<FaGlobe />}
                onPress={() => {
                  if (!userData?.username || !userData?.name) {
                    toast.error('Please complete your profile first')
                    setIsProfileModalOpen(true)
                    return
                  }
                  router.push(`/${userData.username}`)
                }}
              >
                View Public Page
              </DropdownItem>
              <DropdownItem
                key="profile"
                startContent={<FaUserCog />}
                onPress={() => setIsProfileModalOpen(true)}
              >
                Edit Profile
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<FaSignOutAlt />}
                onPress={() => signOut()}
              >
                Sign Out
              </DropdownItem>
              <DropdownItem
                key="feature"
                startContent={<FaLightbulb />}
                onPress={handleFeatureRequest}
              >
                Request Feature
              </DropdownItem>
              <DropdownItem
                key="bug"
                startContent={<FaBug />}
                onPress={handleReportBug}
              >
                Report Bug
              </DropdownItem>
              <DropdownItem
                key="github"
                startContent={<FaGithub />}
                onPress={handleGithubIssue}
              >
                GitHub Issue
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<FaTrash />}
                onPress={handleDeleteAccount}
              >
                Delete Account
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* Main Content */}
      <div className="p-4 sm:p-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-secondary/90 dark:from-primary dark:to-secondary p-6 sm:p-8 mb-8 border border-primary/20 dark:border-white/20">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome back, {userData.name || 'User'}! 👋</h1>
            <p className="text-gray-800 dark:text-white/90">Manage your links and track their performance all in one place.</p>
          </div>
          <div className="absolute right-0 top-0 w-64 h-full opacity-20">
            <div className="w-full h-full bg-gray-900 dark:bg-white transform rotate-12 translate-x-16 translate-y-[-10%]"></div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Regular Link */}
            <Card 
              isPressable
              onPress={() => setIsAddModalOpen(true)}
              className="border border-divider hover:border-primary"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-default-100 dark:bg-default-50 rounded-lg">
                    <FaPlus className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">New Link</h3>
                    <p className="text-sm text-default-500">Add to your profile</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Link Shrink */}
            <Card 
              isPressable
              onPress={() => setIsShrinkModalOpen(true)}
              className="border border-divider hover:border-secondary"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary-100 dark:bg-secondary/20 rounded-lg">
                    <FaCompressArrowsAlt className="text-xl text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Shrink Link</h3>
                    <p className="text-sm text-default-500">Create a short URL</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Profile Settings */}
            <Card 
              isPressable
              onPress={() => setIsProfileModalOpen(true)}
              className="border border-divider hover:border-success"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success-100 dark:bg-success/20 rounded-lg">
                    <FaUserCog className="text-xl text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Edit Profile</h3>
                    <p className="text-sm text-default-500">Update your settings</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* QR Code */}
            <Card 
              isPressable
              onPress={() => setIsQRModalOpen(true)}
              className="border border-divider hover:border-primary"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-default-100 dark:bg-default-50 rounded-lg">
                    <FaQrcode className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">QR Code</h3>
                    <p className="text-sm text-default-500">Generate QR codes</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Documentation */}
            <Card 
              isPressable
              onPress={() => window.open('/docs', '_blank')}
              className="border border-divider hover:border-primary"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-default-100 dark:bg-default-50 rounded-lg">
                    <FaBook className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Documentation</h3>
                    <p className="text-sm text-default-500">View user guides & API docs</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Link Bomb - Coming Soon */}
            <Card 
              isPressable
              className="border border-divider opacity-75 cursor-not-allowed"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-default-100 dark:bg-default-50 rounded-lg">
                    <FaBomb className="text-xl text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">Link Bomb</h3>
                      <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">Coming Soon</span>
                    </div>
                    <p className="text-sm text-default-500">Mass link distribution tool</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Music Profile - Coming Soon */}
            <Card 
              isPressable
              className="border border-divider opacity-75 cursor-not-allowed"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-default-100 dark:bg-default-50 rounded-lg">
                    <FaMusic className="text-xl text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">Music Profile</h3>
                      <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">Coming Soon</span>
                    </div>
                    <p className="text-sm text-default-500">Share your favorite tunes</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Advanced Analytics - Coming Soon */}
            <Card 
              isPressable
              className="border border-divider opacity-75 cursor-not-allowed"
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-default-100 dark:bg-default-50 rounded-lg">
                    <FaChartLine className="text-xl text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">Advanced Analytics</h3>
                      <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">Coming Soon</span>
                    </div>
                    <p className="text-sm text-default-500">Detailed link insights</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Analytics Section with responsive padding */}
        <div className="space-y-6">
          <Analytics links={userData.links || []} />
        </div>

        {/* Links Section with responsive design */}
        <Card className="mt-8">
          <CardBody className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-primary">Your Links</h2>
              <Button
                color="primary"
                size="lg"
                onPress={() => setIsAddModalOpen(true)}
                startContent={<FaPlus />}
                className="w-full sm:w-auto font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add New Link
              </Button>
            </div>

            <div className="space-y-4">
              {userData.links && userData.links.length > 0 ? (
                userData.links.map((link, index) => (
                  <Card key={index} className="w-full">
                    <CardBody className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate">{link.title}</h3>
                          <p className="text-small text-default-500 truncate">{link.url}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => handleCopyLink(link.url)}
                            startContent={<FaLink />}
                          >
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="secondary"
                            onPress={() => {
                              setSelectedLink(link.url)
                              setIsShrinkModalOpen(true)
                            }}
                            startContent={<FaCompressArrowsAlt />}
                          >
                            Shorten
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="secondary"
                            onPress={() => {
                              setSelectedLink(link.url)
                              setIsQRModalOpen(true)
                            }}
                            startContent={<FaQrcode />}
                          >
                            QR Code
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-default-500">No links added yet. Click "Add New Link" to get started!</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modals */}
      <AddLinkModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <ProfileSettingsModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)}
      />
      <ShrinkLinkModal
        isOpen={isShrinkModalOpen}
        onClose={() => setIsShrinkModalOpen(false)}
      />
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />
    </div>
  )
}
