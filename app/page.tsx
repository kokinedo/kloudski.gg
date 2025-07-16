'use client';

import React, { useState } from "react";
import Link from "next/link";
import Particles from "./components/particles";
import { AnimatedSubscribeButton } from "./components/magicui/animated-subscribe-button";

const navigation = [
  // { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

export default function Home() {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
      <nav className="my-16 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm duration-500 text-zinc-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>
      <div className="hidden w-screen h-px animate-glow md:block animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      {/* <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={100} /> */}
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-normal font-sans sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text ">
        kloudski
      </h1>

      <div className="hidden w-screen h-px animate-glow md:block animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="my-16 text-center animate-fade-in">
        <h2 className="text-sm text-white ">
          I'm building{" "}
          <Link
            target="_blank"
            href="https://agenthouse.io"
            className="underline duration-500 hover:text-zinc-300"
          >
            Agenthouse
          </Link>, an AI automation agency that helps businesses streamline their operations with intelligent solutions.
        </h2>
        <form
          className="mt-8 flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto"
          onSubmit={e => {
            e.preventDefault();
            setSubscribed(true);
          }}
        >
          <label htmlFor="newsletter-firstname" className="sr-only">First Name</label>
          <input
            type="text"
            id="newsletter-firstname"
            name="firstName"
            required
            autoComplete="given-name"
            placeholder="First Name"
            className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-12"
            disabled={subscribed}
          />
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            required
            autoComplete="email"
            placeholder="Enter your email"
            className="w-full rounded-md border border-zinc-600 bg-zinc-900 px-4 py-2 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition h-12"
            disabled={subscribed}
          />
          <div className="w-full flex justify-center">
            <AnimatedSubscribeButton subscribeStatus={subscribed} className="w-auto min-w-[160px] px-3 py-2 text-sm">
              <span>Subscribe For Free</span>
              <span>Subscribed!</span>
            </AnimatedSubscribeButton>
          </div>
        </form>
        <p className="mt-4 text-xs text-zinc-400 max-w-md mx-auto">
          No advertisements. No sponsorships. Your privacy is respected, and my only goal is to provide genuine value.
        </p>
      </div>
    </div>
  );
}
