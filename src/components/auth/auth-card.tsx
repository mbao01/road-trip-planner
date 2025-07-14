"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export function AuthCard({
  children,
  title,
  description,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <p className="w-full text-center text-sm">
          {footerText}{" "}
          <Link
            href={footerLink + (searchString ? `?${searchString}` : "")}
            className="font-semibold text-blue-600 hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
