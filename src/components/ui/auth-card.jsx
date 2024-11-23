import * as React from "react"
import { cn } from "@/lib/utils"

const AuthCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm bg-gray-800/50 border-gray-700/50 backdrop-blur-sm",
      className
    )}
    {...props}
  />
))
AuthCard.displayName = "AuthCard"

const AuthCardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
AuthCardHeader.displayName = "AuthCardHeader"

const AuthCardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight text-white",
      className
    )}
    {...props}
  />
))
AuthCardTitle.displayName = "AuthCardTitle"

const AuthCardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground text-gray-400", className)}
    {...props}
  />
))
AuthCardDescription.displayName = "AuthCardDescription"

const AuthCardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
AuthCardContent.displayName = "AuthCardContent"

const AuthCardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
AuthCardFooter.displayName = "AuthCardFooter"

export { AuthCard, AuthCardHeader, AuthCardFooter, AuthCardTitle, AuthCardDescription, AuthCardContent }
