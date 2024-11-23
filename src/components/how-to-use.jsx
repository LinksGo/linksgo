'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Link, Palette, QrCode, Share2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function HowToUse() {
  const [isExpanded, setIsExpanded] = useState(false);

  const features = [
    {
      icon: Link,
      title: "Link Management",
      description: "Add, edit, and reorder your links by dragging. Click 'Add Link' to create new ones."
    },
    {
      icon: Palette,
      title: "Customization",
      description: "Choose themes, upload backgrounds, and personalize your profile in the 'Customize' tab."
    },
    {
      icon: Share2,
      title: "Share Profile",
      description: "Share your unique profile link. Track views in the analytics dashboard."
    },
    {
      icon: QrCode,
      title: "Extra Tools",
      description: "Use URL shortener and QR code generator in 'Other Services' section."
    }
  ];

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Quick Start Guide</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
            ) : (
              <>Learn More <ChevronDown className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={{
              expanded: { height: "auto", opacity: 1 },
              collapsed: { height: "80px", opacity: 1 }
            }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden"
          >
            <div className={`grid gap-4 ${isExpanded ? 'md:grid-cols-2' : ''}`}>
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 bg-primary/10 p-1.5 rounded-md">
                    <feature.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
        )}
      </CardContent>
    </Card>
  );
}
