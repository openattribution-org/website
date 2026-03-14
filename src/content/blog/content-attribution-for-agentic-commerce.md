---
title: "Content attribution for agentic commerce"
subtitle: "We have submitted extension proposals to both UCP and ACP — the two leading agentic commerce protocols. Here is why content attribution belongs in the commerce layer."
date: 2026-02-16
author: "Alex Springer"
tags: [commerce, standards]
reading_time: 5
---

This week we submitted content attribution extensions to both major agentic commerce protocols: a [UCP Enhancement Proposal](https://github.com/openattribution-org/telemetry/blob/main/ucp/ENHANCEMENT_PROPOSAL.md) and an [ACP RFC](https://github.com/openattribution-org/telemetry/tree/main/acp). Here is what they do and why they matter.

## The problem in agentic commerce

When an AI shopping agent recommends a product, that recommendation was influenced by content — reviews, comparison guides, editorial recommendations. The agent retrieved that content, processed it, and used it to form a recommendation that led to a purchase.

Today, there is no way to track which content influenced which purchase. Content creators who produce the reviews and guides that make AI recommendations credible have zero visibility into whether their work drives sales. This is a measurement gap with real commercial consequences.

## What we have proposed

### UCP: checkout extension

The [Unified Commerce Protocol](https://ucp.dev) defines how AI agents interact with merchants during shopping conversations. Our extension adds an `attribution` object to UCP checkout sessions, recording:

- **What content was retrieved** during the conversation
- **What content was cited** in the agent's responses
- **Citation quality signals** — whether the agent quoted, paraphrased, or merely referenced the content, and how prominently
- **Cross-session linking** — connecting research sessions to purchase sessions when the buying journey spans multiple conversations

The extension is additive and non-blocking. It cannot interfere with existing checkout flows. Merchants and agents can adopt incrementally.

### ACP: content attribution

The [Agentic Commerce Protocol](https://www.agenticcommerce.dev/) already has `affiliate_attribution` for network-level attribution with pre-wired publisher mappings. Our `content_attribution` extension provides the complementary content-level layer:

- **affiliate_attribution**: "This purchase came through publisher X on network Y" (requires prior setup)
- **content_attribution**: "The agent read and cited these URLs during the conversation" (no prior setup needed)

Together they solve the bootstrapping problem. Content attribution provides the raw URL data. Affiliate networks can resolve those URLs against their publisher registries to identify which publishers created the cited content. Standard commission crediting applies from there.

## Why this belongs in the commerce protocol

Content attribution at the commerce layer solves three problems that cannot be solved elsewhere:

**1. It connects content to outcomes.** Attribution only matters if you can tie content influence to a measurable result. Commerce protocols already know the outcome — a purchase happened. Adding content signals to the checkout session creates the connection.

**2. It is transport-agnostic.** The same content attribution schema works whether the agent uses MCP, REST, or any other integration pattern. By embedding it in the commerce protocol, we avoid fragmenting attribution across transport layers.

**3. It enables market mechanisms.** Once you can measure which content drives which purchases, you can build compensation models, content partnerships, and marketplace dynamics. The commerce protocol is where money already flows — adding attribution data makes that flow smarter.

## Privacy by design

Both extensions support four privacy granularity levels:

| Level | What is shared |
|-------|---------------|
| **full** | URLs, timestamps, citation details, conversation summary |
| **summary** | Aggregated counts and topic categories only |
| **intent** | Primary intent and topic, no content details |
| **minimal** | Content count and session outcome only |

The default is `minimal`. Agents and merchants negotiate the appropriate level based on their privacy agreements.

## What comes next

Both proposals are now in review with their respective protocol governance bodies. The UCP Enhancement Proposal includes graduation criteria — from Working Draft through Candidate to Stable — requiring independent implementations and interoperability testing.

We have published a [reference implementation](https://github.com/openattribution-org/telemetry) with a Python SDK, FastAPI reference server, and JSON Schemas. It is Apache 2.0 licensed and ready for anyone to build on.

If you are building agentic commerce infrastructure — whether as a merchant platform, agent framework, or affiliate network — we would be interested in your feedback on the proposals. [Get in touch](https://openattribution.org/#contact).
