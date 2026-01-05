---
layout: spec
title: "Architecture Overview"
section: true
prev:
  title: "Design Principles"
  url: "spec/03-design-principles.html"
next:
  title: "Foundation Layer"
  url: "spec/05-foundation-layer.html"
---

# 4. Architecture Overview

The OpenAttribution AI Manifest Standard has four components that form a complete trust and transparency layer.

## 4.1 AI System Identifier (Fingerprint)

Every AI system in the AIMS ecosystem gets a stable, globally unique identifier based on the W3C Decentralized Identifier (DID) specification. This identifier anchors all manifest data cryptographically and is used for identity verification during inter-agent communication.

**Identifier Format:**

```
did:aims:<method>:<organization>:<system-id>
```

**Examples:**

- `did:aims:web:anthropic:claude-4-sonnet` — Anthropic's Claude Sonnet model
- `did:aims:web:homedepot:product-assistant-v2` — Home Depot's product recommendation agent
- `did:aims:web:user-12345:personal-agent` — An individual user's personal AI agent

The DID resolves to a DID Document containing the public keys needed to verify signed manifests and the service endpoints for manifest lookup.

> **Note:** The full `did:aims` method specification (syntax, CRUD operations, resolution algorithm) is left for future work or community contribution. See [Open Questions](13-open-questions.md).

## 4.2 Manifest Store

The Manifest Store is a distributed registry where AI Manifests get published and retrieved. Multiple implementations can coexist: centralized registries run by industry consortia, decentralized solutions using content-addressed storage (IPFS, blockchain anchoring), or simple HTTPS endpoints hosted by AI providers.

**Key Properties:**

- **Content Addressable:** Each manifest version has a unique hash for integrity verification
- **Version History:** Manifests are versioned with timestamps; historical versions stay accessible for audit
- **Federated:** No single registry monopoly; resolvers can query multiple stores
- **Cached:** Clients should cache manifests with appropriate TTLs to reduce lookup latency

## 4.3 AI Manifest

The AI Manifest is the core payload. It's a structured JSON-LD document describing an AI system's provenance, tuning, and capabilities. It can be cryptographically signed as a Verifiable Credential. The manifest has three layers:

- **Foundation Layer:** Base model training data provenance ([Section 5](05-foundation-layer.md))
- **Tuning Layer:** Behavioral modifications and alignment ([Section 6](06-tuning-layer.md))
- **Capabilities Layer:** Runtime access, tools, and licensed content ([Section 7](07-capabilities-layer.md))

## 4.4 Verification Protocol

The Verification Protocol defines how AI systems authenticate to each other and verify manifest claims. It combines cryptographic identity verification with manifest lookup for capability understanding. See [Section 8](08-verification-protocol.md) for details.

---

Previous: [Design Principles](03-design-principles.md) | Next: [Foundation Layer](05-foundation-layer.md)
