---
layout: spec
title: "Design Principles"
section: true
prev:
  title: "Problem Statement"
  url: "spec/02-problem-statement.html"
next:
  title: "Architecture Overview"
  url: "spec/04-architecture.html"
---

# 3. Design Principles

The OpenAttribution AI Manifest Standard follows these principles:

**Standards Alignment:** Use established W3C specifications (DIDs, Verifiable Credentials, JSON-LD) rather than inventing parallel systems. Integrate with RSL for content licensing and A2A/MCP for agent communication.

**Progressive Disclosure:** Support different levels of detail. Some consumers need high-level categorical summaries. Others need cryptographic commitments for selective audit disclosure. Not everyone needs terabytes of training data metadata.

**Verifiable Claims:** Every manifest assertion should be cryptographically signed and verifiable. Claims without verification mechanisms are just documentation, not trust infrastructure.

**Layered Architecture:** Keep stable identity (the fingerprint/DID) separate from dynamic content (the manifest). Manifests change over time. Identifiers persist.

**Privacy by Design:** Support selective disclosure. An AI system should be able to prove it trained on licensed data without revealing its complete training corpus.

**Ecosystem Neutrality:** The standard must work across AI providers, hosting platforms, and jurisdictions. No single entity controls the registry or verification infrastructure.

---

Previous: [Problem Statement](02-problem-statement.md) | Next: [Architecture Overview](04-architecture.md)
