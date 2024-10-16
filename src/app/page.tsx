"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck } from "lucide-react";

export default function RecaptchaForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isVerified, setIsVerified] = useState(false);

  async function handleCaptchaSubmission(token: string | null) {
    try {
      if (token) {
        const response = await fetch("/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      }
    } catch (error) {
      console.error("Error during reCAPTCHA submission:", error);
      setIsVerified(false);
    }
  }

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token);
  };

  const handleExpired = () => {
    setIsVerified(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Secure Form Submission</CardTitle>
          <CardDescription>
            Please complete the reCAPTCHA to proceed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
              ref={recaptchaRef}
              onChange={handleChange}
              onExpired={handleExpired}
            />
          </div>
          <Button className="w-full" type="submit" disabled={!isVerified}>
            {isVerified ? (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Submit Form
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Verify to Submit
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
