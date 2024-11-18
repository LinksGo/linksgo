'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardBody, Button } from "@nextui-org/react"
import Link from 'next/link'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardBody className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-danger">Authentication Error</h1>
          <p className="text-default-600">
            {error === 'OAuthCallback'
              ? 'There was a problem with the authentication process. Please try again.'
              : 'An error occurred during authentication.'}
          </p>
          <div className="flex justify-center">
            <Button
              as={Link}
              href="/auth/signin"
              color="primary"
              variant="solid"
              className="font-semibold"
            >
              Try Again
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
