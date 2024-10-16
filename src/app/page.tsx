"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import type { NextPage } from "next";

const Page: NextPage = () => {
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
    <main className="flex flex-col items-center mt-10 gap-3">
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ""}
        ref={recaptchaRef}
        onChange={handleChange}
        onExpired={handleExpired}
      />
      <button
        className="border p-2 bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        type="submit"
        disabled={!isVerified}
      >
        Submit Form
      </button>
    </main>
  );
};

export default Page;
