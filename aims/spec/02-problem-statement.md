---
layout: spec
title: "Problem Statement"
section: true
prev:
  title: "Executive Summary"
  url: "spec/01-executive-summary.html"
next:
  title: "Design Principles"
  url: "spec/03-design-principles.html"
---

# 2. Problem Statement

## 2.1 The Transparency Gap

AI systems today are opaque. When one generates content, makes recommendations, or interacts with users, there's no standardized way to know what data trained it, what behavioral constraints govern its responses, or what external sources it can pull from.

**Copyright and Licensing Compliance:** Content creators and publishers can't tell whether their work trained an AI model, or on what terms. RSL provides machine-readable licensing for web content, but AI systems have no corresponding way to declare their training data provenance or prove compliance.

**Bias and Safety Assessment:** Organizations can't properly assess an AI system's biases without knowing what's in its training data. The EU AI Act demands transparency documentation for high-risk AI systems. Current model cards only partially meet these requirements.

**Agent-to-Agent Trust:** AI agents increasingly work together. A user's personal assistant might interact with a retailer's product recommendation agent. Right now there's no way for agents to verify each other's identity, understand each other's data sources, or set appropriate trust boundaries.

## 2.2 The Agentic Ecosystem Problem

A user asks their personal AI assistant to help design a kitchen renovation. The assistant needs to interact with a home improvement retailer's AI agent to explore products, check availability, and compare options. This raises hard questions:

- How does the user's agent verify it's talking to the legitimate retailer agent and not an imposter?
- What data sources inform the retailer agent's recommendations?
- Does the retailer agent have access to proprietary content the user's agent can't directly use?
- How should content licensing work when agents with different access rights share information?

AIMS answers these questions through cryptographically verifiable manifests that travel with any AI system in the ecosystem, or can be looked up on demand.

---

Previous: [Executive Summary](01-executive-summary.md) | Next: [Design Principles](03-design-principles.md)
