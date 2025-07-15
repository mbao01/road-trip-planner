"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { GripVertical, MoreVertical, Plus, Trash2 } from "lucide-react";

function TripCard({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-foreground">Northbound Up</h3>
          <p className="text-sm text-muted-foreground">14/08/2025 - 16/08/2025</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Owner
        </Badge>
      </CardContent>
    </Card>
  );
}

function DayPlannerCard({ className }: { className?: string }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-lg">Day 1</CardTitle>
          <p className="text-sm text-muted-foreground">Thu, 14 Aug</p>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <p className="text-xs text-muted-foreground text-center">0.0 mi, (£0.00), 0 hr</p>
        <div className="flex items-center gap-2 p-2 rounded-lg border bg-background">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            1
          </div>
          <span className="flex-grow font-medium text-foreground">London</span>
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </div>
        <p className="text-xs text-muted-foreground text-center">0.0 mi, (£0.00), 0 hr</p>
        <div className="flex items-center gap-2 p-2 rounded-lg border bg-background">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="flex-grow font-medium text-foreground">Milton Keynes</span>
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </div>
        <div className="relative mt-2">
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Add stop" className="pl-8 bg-background" />
        </div>
      </CardContent>
    </Card>
  );
}

function ShareCard({ className }: { className?: string }) {
  const [isPublic, setIsPublic] = useState(false);
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Share &quot;Northbound Up&quot;</CardTitle>
        <p className="text-sm text-muted-foreground">
          Invite collaborators or share a public link.
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div>
          <p className="text-sm font-medium mb-2 text-foreground">Invite by email</p>
          <div className="flex gap-2">
            <Input placeholder="Enter email address" className="ring-primary focus:ring-primary" />
            <Button variant="secondary">Viewer</Button>
            <Button className="bg-orange-200 text-orange-800 hover:bg-orange-300">Invite</Button>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2 text-foreground">Shared with</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-foreground">Sam Smith</p>
                  <p className="text-xs text-muted-foreground">editor@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  Editor
                </Button>
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>TJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-foreground">Taylor Jones</p>
                  <p className="text-xs text-muted-foreground">viewer@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm">
                  Viewer
                </Button>
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm text-foreground">You</p>
                  <p className="text-xs text-muted-foreground">owner@example.com</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Owner
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-sm font-medium text-foreground">Public access</p>
          <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        </div>
      </CardContent>
    </Card>
  );
}

export function FeatureShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  } as const;

  const pathVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  } as const;

  return (
    <div ref={ref} className="w-full py-12 scale-75">
      <div className="container mx-auto px-4">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex flex-col items-center gap-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
              className="w-full max-w-sm"
            >
              <TripCard />
            </motion.div>
            <div className="h-16 w-px bg-border border-dashed border-2" />
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.4 }}
              className="w-full max-w-sm"
            >
              <DayPlannerCard />
            </motion.div>
            <div className="h-16 w-px bg-border border-dashed border-2" />
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.6 }}
              className="w-full max-w-sm"
            >
              <ShareCard />
            </motion.div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block relative h-[700px]">
          <motion.div
            className="absolute top-0 left-0 w-[45%]"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.2 }}
          >
            <TripCard />
          </motion.div>

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 right-0 w-[45%]"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.6 }}
          >
            <DayPlannerCard />
          </motion.div>

          <motion.div
            className="absolute bottom-0 left-0 w-[45%]"
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 1.0 }}
          >
            <ShareCard />
          </motion.div>

          <svg
            className="absolute top-0 left-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 100 100"
          >
            <motion.path
              d="M 45 15 C 50 15, 50 50, 55 50"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="1 1"
              variants={pathVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.4 }}
            />
            <motion.path
              d="M 55 50 C 50 50, 50 85, 45 85"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              fill="none"
              strokeDasharray="1 1"
              variants={pathVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.8 }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
