---
layout: spec
title: "Integration with RSL and A2A"
section: true
prev:
  title: "Verification Protocol"
  url: "spec/08-verification-protocol.html"
next:
  title: "Core Schema Reference"
  url: "spec/10-core-schema.html"
---

# 9. Integration with Existing Standards

AIMS complements existing standards rather than replacing them.

## 9.1 W3C Decentralized Identifiers (DIDs)

AIMS uses DIDs as the core identifier for AI systems. The DID specification (W3C Recommendation, July 2022) provides globally unique, cryptographically verifiable identifiers that don't depend on centralized registries. AIMS defines a new DID method (`did:aims`) with resolution semantics specific to AI system manifests.

> **Note:** The full `did:aims` method specification is left for future work.

## 9.2 W3C Verifiable Credentials

AI Manifests can be packaged as Verifiable Credentials (W3C Recommendation, May 2025). This provides:

- Cryptographic signing by the issuing organization
- Selective disclosure of manifest sections
- Revocation and status checking
- Credential chaining for derivative models

## 9.3 Really Simple Licensing (RSL)

RSL (v1.0, December 2025) provides machine-readable licensing terms for web content. AIMS integrates with RSL at two levels:

- The **Foundation Layer** can reference RSL compliance for training data
- The **Capabilities Layer** can declare RSL licenses held for runtime content access

The Open License Protocol (OLP) handles agent-to-agent license negotiation.

## 9.4 Agent-to-Agent Protocol (A2A)

A2A (originally launched by Google, now under Linux Foundation governance) standardizes inter-agent communication. AIMS extends the A2A Agent Card concept with full provenance manifests. The AIMS verification handshake can slot into A2A's authentication flow, providing richer trust semantics than A2A's baseline capability advertisement.

## 9.5 Model Context Protocol (MCP)

MCP (developed by Anthropic) standardizes how AI systems connect to tools and data sources. The AIMS Capabilities Layer can reference MCP server configurations, making it transparent which MCP tools an AI system can access.

## 9.6 C2PA Content Credentials

The C2PA specification provides content provenance for media assets. AIMS can reference C2PA manifests for training data where available, bridging content-level and system-level provenance. AI-generated content could carry both:

- C2PA credentials (for the output)
- AIMS references (to the generating system)

## 9.7 EU AI Act Compliance

The EU AI Act (Regulation 2024/1689) requires transparency documentation for high-risk AI systems and general-purpose AI models. AIMS manifests can satisfy many of these requirements, particularly:

- Article 11 (technical documentation)
- Article 13 (transparency to deployers)
- Article 53 (obligations for GPAI model providers)

## 9.8 Model Cards

Model Cards (Google Research, 2018) provide a documentation framework for ML models. AIMS manifests are complementary:

- Model Cards are human-readable documentation
- AIMS manifests are machine-readable and cryptographically verifiable

Organizations may publish both.

---

Previous: [Verification Protocol](08-verification-protocol.md) | Next: [Core Manifest Schema](10-core-schema.md)
