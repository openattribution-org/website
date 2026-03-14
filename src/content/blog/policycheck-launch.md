---
title: "PolicyCheck: see which AI bots can access any website"
subtitle: "A free tool that checks robots.txt, RSL licences, and Cloudflare Content Signals for 26+ AI crawlers. Now live on openattribution.org."
date: 2026-02-15
author: "Alex Springer"
tags: [tools]
reading_time: 3
---

[PolicyCheck](https://openattribution.org/policycheck/) is now live on OpenAttribution.org. It is a free tool that shows which AI bots can access any website.

It checks three signals — `robots.txt` files, [RSL](https://rslstandard.org/) licences, and Cloudflare's Content Signals Policy — for GPTBot, ClaudeBot, Perplexity, and 20+ other AI crawlers. You can check a single URL, or upload a CSV and get results for all of them. Everything is downloadable as JSON or CSV.

## Three signals, three different questions

If you are building agents or scrapers, it is worth understanding all three signals. They answer different questions and all matter:

**robots.txt** tells you whether a bot is technically allowed to crawl. It is the oldest and most widely supported signal, but it is binary (allow/disallow) and says nothing about what you can do with the content once you have it.

**RSL (Really Simple Licensing)** sets out the terms under which content can actually be used. It goes beyond crawl access to specify whether AI training, indexing, or inference is permitted, and what compensation is required. RSL is still in very early adoption — you will not see licences across most sites just yet, but it is the direction the ecosystem is heading.

**Cloudflare's Content Signals Policy** gives site owners another way to express how their content should be handled by AI systems, layered on top of their CDN configuration.

## Why this matters

A publisher blocking AI bots is doing the right thing. They are asserting the value of their content and trying to set terms for how it is used. The advertising and media industry should be working together to find ways to support this, not undermine it.

The reality is that AI visibility in the mid-to-long term is about much more than short-term hacks and trying to game the algorithms. Brands and publishers should be working together on this. Understanding who is blocking what and why is a starting point for that conversation, not a way to route around it.

## How to use it

1. Go to [openattribution.org/policycheck/](https://openattribution.org/policycheck/)
2. Enter a URL or upload a CSV of URLs
3. See results for 26+ AI crawlers across all three signal types
4. Download results as JSON or CSV

## Open source

PolicyCheck is open source and also available as a Rust crate if you want to use it as a service or utility in your own projects:

- [GitHub: openattribution-org/policycheck](https://github.com/openattribution-org/policycheck)
- [Crates.io: policycheck](https://crates.io/crates/policycheck)

Built as part of the [OpenAttribution](https://openattribution.org) initiative.
