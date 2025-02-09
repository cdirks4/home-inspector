"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Error 404</h1>
        
        <p className="text-lg mb-8 text-foreground/80">
          This page does not exist.<br />
          Check for spelling mistakes or go back to the previous page.
        </p>

        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Popular pages</h2>
            
            <div className="space-y-4">
              <Link 
                href="/docs" 
                className="block hover:underline hover:underline-offset-4"
              >
                <h3 className="font-semibold">Documentation</h3>
                <p className="text-sm text-foreground/70">
                  Learn how to integrate our tools with your app
                </p>
              </Link>

              <Link 
                href="/blog" 
                className="block hover:underline hover:underline-offset-4"
              >
                <h3 className="font-semibold">Blog</h3>
                <p className="text-sm text-foreground/70">
                  Read our latest news and articles
                </p>
              </Link>
            </div>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex rounded-full border border-solid border-transparent transition-colors items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6"
            >
              Go back home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
