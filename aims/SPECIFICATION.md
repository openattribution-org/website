---
layout: spec
title: "Full Specification"
description: "Complete AIMS specification in a single document"
---

# OpenAttribution AI Manifest Standard

**An Open Standard for AI System Transparency, Provenance, and Agent-to-Agent Trust**

**Draft Specification v0.1** | December 2025

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Design Principles](#3-design-principles)
4. [Architecture Overview](#4-architecture-overview)
5. [Foundation Layer Specification](#5-foundation-layer-specification)
6. [Tuning Layer Specification](#6-tuning-layer-specification)
7. [Capabilities Layer Specification](#7-capabilities-layer-specification)
8. [Agent Verification Protocol](#8-agent-verification-protocol)
9. [Integration with Existing Standards](#9-integration-with-existing-standards)
10. [Core Manifest Schema](#10-core-manifest-schema)
11. [Use Cases](#11-use-cases)
12. [Governance and Adoption](#12-governance-and-adoption)
13. [Open Questions for Discussion](#13-open-questions-for-discussion)
14. [Conclusion](#14-conclusion)
- [Appendix A: Related Standards Reference](#appendix-a-related-standards-reference)
- [Appendix B: Glossary](#appendix-b-glossary)

---

## 1. Executive Summary

The OpenAttribution AI Manifest Standard (AIMS) is an open, interoperable framework for declaring and verifying the provenance, capabilities, and data sources of large language models and the AI systems built on top of them. AI agents now routinely interact with each other and with content across the web. A standardized transparency and attribution framework has become necessary.

This specification tackles three problems:

1. **Training Data Transparency:** Where did the base model's training data come from? What's its licensing status? What biases might be baked in?

2. **Tuning and Alignment Disclosure:** What behavioral modifications, value alignments, and content policies were applied through fine-tuning and system prompting?

3. **Runtime Capabilities:** What data sources, tools, and licensed content can an AI system access during inference? How can agents verify this about each other?

AIMS builds on established W3C standards including Decentralized Identifiers (DIDs) and Verifiable Credentials. It integrates with Really Simple Licensing (RSL) for content rights and the Agent-to-Agent (A2A) protocol for inter-agent communication. OpenAttribution, a coalition of publishers, brands, and technology providers, developed this specification to provide a trust layer for the agentic AI ecosystem.

---

## 2. Problem Statement

### 2.1 The Transparency Gap

AI systems today are opaque. When one generates content, makes recommendations, or interacts with users, there's no standardized way to know what data trained it, what behavioral constraints govern its responses, or what external sources it can pull from.

**Copyright and Licensing Compliance:** Content creators and publishers can't tell whether their work trained an AI model, or on what terms. RSL provides machine-readable licensing for web content, but AI systems have no corresponding way to declare their training data provenance or prove compliance.

**Bias and Safety Assessment:** Organizations can't properly assess an AI system's biases without knowing what's in its training data. The EU AI Act demands transparency documentation for high-risk AI systems. Current model cards only partially meet these requirements.

**Agent-to-Agent Trust:** AI agents increasingly work together. A user's personal assistant might interact with a retailer's product recommendation agent. Right now there's no way for agents to verify each other's identity, understand each other's data sources, or set appropriate trust boundaries.

### 2.2 The Agentic Ecosystem Problem

A user asks their personal AI assistant to help design a kitchen renovation. The assistant needs to interact with a home improvement retailer's AI agent to explore products, check availability, and compare options. This raises hard questions:

- How does the user's agent verify it's talking to the legitimate retailer agent and not an imposter?
- What data sources inform the retailer agent's recommendations?
- Does the retailer agent have access to proprietary content the user's agent can't directly use?
- How should content licensing work when agents with different access rights share information?

AIMS answers these questions through cryptographically verifiable manifests that travel with any AI system in the ecosystem, or can be looked up on demand.

---

## 3. Design Principles

The OpenAttribution AI Manifest Standard follows these principles:

**Standards Alignment:** Use established W3C specifications (DIDs, Verifiable Credentials, JSON-LD) rather than inventing parallel systems. Integrate with RSL for content licensing and A2A/MCP for agent communication.

**Progressive Disclosure:** Support different levels of detail. Some consumers need high-level categorical summaries. Others need cryptographic commitments for selective audit disclosure. Not everyone needs terabytes of training data metadata.

**Verifiable Claims:** Every manifest assertion should be cryptographically signed and verifiable. Claims without verification mechanisms are just documentation, not trust infrastructure.

**Layered Architecture:** Keep stable identity (the fingerprint/DID) separate from dynamic content (the manifest). Manifests change over time. Identifiers persist.

**Privacy by Design:** Support selective disclosure. An AI system should be able to prove it trained on licensed data without revealing its complete training corpus.

**Ecosystem Neutrality:** The standard must work across AI providers, hosting platforms, and jurisdictions. No single entity controls the registry or verification infrastructure.

---

## 4. Architecture Overview

The OpenAttribution AI Manifest Standard has four components that form a complete trust and transparency layer.

### 4.1 AI System Identifier (Fingerprint)

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

> **Note:** The full `did:aims` method specification (syntax, CRUD operations, resolution algorithm) is left for future work or community contribution. See Section 13, Open Questions.

### 4.2 Manifest Store

The Manifest Store is a distributed registry where AI Manifests get published and retrieved. Multiple implementations can coexist: centralized registries run by industry consortia, decentralized solutions using content-addressed storage (IPFS, blockchain anchoring), or simple HTTPS endpoints hosted by AI providers.

**Key Properties:**

- **Content Addressable:** Each manifest version has a unique hash for integrity verification
- **Version History:** Manifests are versioned with timestamps; historical versions stay accessible for audit
- **Federated:** No single registry monopoly; resolvers can query multiple stores
- **Cached:** Clients should cache manifests with appropriate TTLs to reduce lookup latency

### 4.3 AI Manifest

The AI Manifest is the core payload. It's a structured JSON-LD document describing an AI system's provenance, tuning, and capabilities. It can be cryptographically signed as a Verifiable Credential. The manifest has three layers:

- **Foundation Layer:** Base model training data provenance (Section 5)
- **Tuning Layer:** Behavioral modifications and alignment (Section 6)
- **Capabilities Layer:** Runtime access, tools, and licensed content (Section 7)

### 4.4 Verification Protocol

The Verification Protocol defines how AI systems authenticate to each other and verify manifest claims. It combines cryptographic identity verification with manifest lookup for capability understanding. See Section 8 for details.

---

## 5. Foundation Layer Specification

The Foundation Layer documents where a base model's training data came from. Modern LLMs train on billions of documents, so this layer uses hierarchical abstraction: high-level summaries for public disclosure, cryptographic commitments for selective verification by auditors.

*Core question: What went into building this model?*

### 5.1 Schema Structure

```json
{
  "foundation": {
    "version": "2025-12-19T00:00:00Z",
    "baseModel": {
      "name": "string",
      "version": "string",
      "releaseDate": "ISO-8601 date",
      "parentModel": "did:aims:... (optional)"
    },
    "trainingData": {
      "summary": { ... },
      "commitments": { ... },
      "rslCompliance": { ... }
    }
  }
}
```

### 5.2 Training Data Summary

High-level categorical breakdown for public disclosure. End users and basic integrations will see this.

#### 5.2.1 Data Categories

Percentage breakdown by source type:

| Category | Description |
|----------|-------------|
| `webCrawl` | General web content |
| `books` | Published books and long-form text |
| `code` | Source code repositories |
| `academic` | Research papers, journals |
| `licensedDatasets` | Commercially licensed training sets |
| `syntheticData` | AI-generated training content |
| `conversational` | Dialog and chat data |
| `other` | Uncategorized sources |

#### 5.2.2 Temporal Distribution

Date ranges of source content creation or publication:

```json
"temporalRange": {
  "earliest": "1900-01-01",
  "latest": "2025-06-01",
  "medianDate": "2019-03-15"
}
```

#### 5.2.3 Language Distribution

Percentage breakdown by language:

```json
"languages": {
  "en": 0.72,
  "zh": 0.08,
  "es": 0.04,
  "fr": 0.03,
  "de": 0.03,
  "other": 0.10
}
```

#### 5.2.4 Domain Coverage

Rough representation across knowledge domains (values are relative, not percentages):

```json
"domains": {
  "science": 0.15,
  "technology": 0.20,
  "law": 0.05,
  "medicine": 0.08,
  "finance": 0.06,
  "arts": 0.10,
  "general": 0.36
}
```

### 5.3 Cryptographic Commitments

Detailed provenance that can't be fully disclosed publicly but must remain verifiable.

#### 5.3.1 Merkle Root

A hash commitment to the complete training data manifest. With this, a system can prove specific sources were or weren't included without revealing the full dataset.

```json
"commitments": {
  "merkleRoot": "sha256:a1b2c3d4e5f6...",
  "algorithm": "sha256",
  "leafCount": 2847293847,
  "generated": "2025-06-15T00:00:00Z"
}
```

> **Note:** Merkle proof generation, format, and verification procedures are left for future specification.

#### 5.3.2 Audit Endpoint

URL for authorized third-party auditors to verify detailed provenance claims. Access requires authentication and audit agreements.

```json
"auditEndpoint": {
  "url": "https://api.anthropic.com/aims/audit/v1",
  "authMethod": "oauth2",
  "auditorRequirements": "https://anthropic.com/aims-auditor-program"
}
```

### 5.4 RSL Compliance

Declaration of compliance with Really Simple Licensing terms for web-crawled content:

```json
"rslCompliance": {
  "compliant": true,
  "policyVersion": "1.0",
  "crawlPolicy": {
    "respectsRobotsTxt": true,
    "respectsRslHeaders": true,
    "honoredSince": "2024-01-01"
  },
  "attestation": {
    "issuer": "did:web:anthropic.com",
    "issued": "2025-06-15T00:00:00Z",
    "signature": "..."
  }
}
```

#### 5.4.1 Licensing Summary

Aggregate statistics on the licensing status of training data:

```json
"licensingSummary": {
  "publicDomain": 0.12,
  "creativeCommons": 0.08,
  "commercialLicense": 0.25,
  "rslCompliant": 0.35,
  "unknownStatus": 0.20
}
```

### 5.5 Derivative Models

When a model is fine-tuned from a base model, reference the parent:

```json
"baseModel": {
  "name": "product-assistant-v2",
  "version": "2.1.0",
  "releaseDate": "2025-12-01",
  "parentModel": "did:aims:web:meta:llama-3-70b",
  "derivationType": "fine-tune",
  "additionalTrainingData": {
    "summary": { ... }
  }
}
```

The `parentModel` DID lets consumers look up the base model's Foundation Layer and trace the full provenance chain.

---

## 6. Tuning Layer Specification

The Tuning Layer documents modifications applied to a base model that shape its behavior, values, and response characteristics. This covers both fine-tuning (weight changes) and inference-time controls (system prompts, content filters).

*Core question: How was this model shaped to behave?*

### 6.1 Schema Structure

```json
{
  "tuning": {
    "version": "2025-12-19T00:00:00Z",
    "alignment": { ... },
    "contentPolicies": { ... },
    "promptingAgenda": { ... },
    "knownLimitations": { ... }
  }
}
```

### 6.2 Alignment Documentation

#### 6.2.1 Methodology

Description of alignment techniques applied:

```json
"alignment": {
  "methodology": {
    "techniques": [
      { "name": "RLHF", "description": "Reinforcement Learning from Human Feedback", "applied": true },
      { "name": "Constitutional AI", "description": "Self-critique against defined principles", "applied": true },
      { "name": "DPO", "description": "Direct Preference Optimization", "applied": false }
    ],
    "humanFeedbackScale": "large",
    "syntheticFeedbackUsed": true
  }
}
```

#### 6.2.2 Value Frameworks

Declared ethical principles and value alignments. These describe what the system was trained toward:

```json
"valueFrameworks": {
  "principles": [
    "Helpfulness: Assist users in accomplishing their goals",
    "Harmlessness: Avoid causing harm or enabling harmful actions",
    "Honesty: Provide accurate information and acknowledge uncertainty"
  ],
  "prioritization": "When principles conflict, harmlessness takes precedence",
  "documentationUrl": "https://anthropic.com/claude-values"
}
```

#### 6.2.3 Safety Training

```json
"safetyTraining": {
  "categories": [
    "Refusal of harmful requests",
    "Bias mitigation",
    "Factuality and uncertainty expression",
    "Privacy protection"
  ],
  "redTeaming": {
    "conducted": true,
    "internalTeams": true,
    "externalTeams": true,
    "bugBounty": true
  },
  "evaluations": {
    "safetyBenchmarks": ["TruthfulQA", "BBQ", "RealToxicityPrompts"],
    "resultsUrl": "https://anthropic.com/claude-evals"
  }
}
```

### 6.3 Content Policies

#### 6.3.1 Prohibited Content

Categories of content the system refuses to generate or assist with:

```json
"prohibited": [
  { "category": "CSAM", "description": "Child sexual abuse material", "enforcement": "absolute" },
  { "category": "weapons_mass_destruction", "description": "Instructions for biological, chemical, nuclear, or radiological weapons", "enforcement": "absolute" },
  { "category": "malware", "description": "Functional malicious code", "enforcement": "absolute" }
]
```

#### 6.3.2 Sensitive Topics

Topics subject to special handling, caveats, or guardrails:

```json
"sensitiveTopics": [
  { "category": "medical_advice", "handling": "Provides general information with disclaimer to consult professionals", "caveats": true },
  { "category": "legal_advice", "handling": "Provides general information with disclaimer about jurisdiction-specific laws", "caveats": true },
  { "category": "political_content", "handling": "Attempts balanced presentation of multiple viewpoints", "caveats": true },
  { "category": "self_harm", "handling": "Redirects to crisis resources when appropriate", "caveats": true }
]
```

#### 6.3.3 Jurisdictional Variations

Region-specific policy adaptations:

```json
"jurisdictionalVariations": [
  { "region": "EU", "variations": ["Enhanced privacy protections per GDPR", "AI Act transparency compliance"] },
  { "region": "CN", "variations": ["Content restrictions per local regulations"], "available": false }
]
```

### 6.4 Prompting Agenda

Inference-time behavioral shaping. Full system prompts are typically proprietary, but this section describes intent.

#### 6.4.1 System Prompt Summary

```json
"promptingAgenda": {
  "systemPromptSummary": {
    "description": "High-level behavioral instructions",
    "themes": [
      "Helpful and conversational tone",
      "Acknowledges uncertainty when appropriate",
      "Declines harmful requests politely",
      "Cites sources when making factual claims"
    ],
    "length": "medium",
    "lastUpdated": "2025-12-01"
  }
}
```

#### 6.4.2 Persona Declaration

If the system adopts a persona:

```json
"persona": {
  "hasPersona": true,
  "name": "Claude",
  "description": "An AI assistant created by Anthropic",
  "traits": ["curious", "thoughtful", "direct"],
  "claimsHumanity": false
}
```

For brand-specific agents:

```json
"persona": {
  "hasPersona": true,
  "name": "Home Depot Product Assistant",
  "description": "A shopping assistant for Home Depot customers",
  "traits": ["knowledgeable about home improvement", "helpful", "product-focused"],
  "brandAssociation": "The Home Depot, Inc."
}
```

#### 6.4.3 Bias Declarations

Known or intentional biases that affect system behavior:

```json
"biasDeclarations": [
  { "type": "intentional", "description": "Recommendations prioritize Home Depot products over competitors", "reason": "System is operated by Home Depot for their customers" },
  { "type": "known_limitation", "description": "May have reduced performance on low-resource languages", "mitigation": "Documented in model card; ongoing improvement efforts" }
]
```

### 6.5 Known Limitations

Documented weaknesses and failure modes:

```json
"knownLimitations": {
  "factuality": {
    "description": "May generate plausible-sounding but incorrect information",
    "severity": "medium",
    "mitigation": "Trained to express uncertainty; users should verify critical facts"
  },
  "recency": {
    "description": "Knowledge has a training cutoff date",
    "cutoffDate": "2025-06-01",
    "mitigation": "Can be connected to real-time data sources via Capabilities Layer"
  },
  "reasoning": {
    "description": "May make errors in complex multi-step reasoning",
    "severity": "medium",
    "mitigation": "Chain-of-thought prompting can help; users should verify logic"
  },
  "languages": {
    "description": "Performance varies by language",
    "strongLanguages": ["en", "fr", "de", "es", "zh"],
    "limitedLanguages": ["low-resource languages generally"]
  }
}
```

---

## 7. Capabilities Layer Specification

The Capabilities Layer documents what an AI system can access at inference time: tools, data sources, external systems, and licensed content. This is the most dynamic layer, potentially changing per deployment, per session, or per user context.

*Core questions: What can this system do? What content is it authorized to use?*

### 7.1 Why Licensed Content Matters

When AI agents interact, content licensing creates problems. Consider: Agent A has a license to access Reuters news content. Agent B does not. Agent A summarizes a Reuters article for Agent B. Has Agent B now received content it isn't licensed for?

The Capabilities Layer makes these licensing boundaries explicit. Agents can check each other's manifests before deciding what information to share.

### 7.2 Schema Structure

```json
{
  "capabilities": {
    "version": "2025-12-19T00:00:00Z",
    "scope": "deployment | session | user",
    "dataSources": { ... },
    "tools": { ... },
    "licensedContent": { ... }
  }
}
```

### 7.3 Capability Scope

Capabilities can be declared at different levels:

| Scope | Description | Update Frequency |
|-------|-------------|------------------|
| `deployment` | Fixed for this deployment of the system | Rarely changes |
| `session` | Varies per conversation/session | Per session |
| `user` | Varies based on authenticated user | Per user |

### 7.4 Data Sources

#### 7.4.1 Web Access

```json
"dataSources": {
  "webAccess": {
    "enabled": true,
    "searchEngines": ["google", "bing"],
    "directFetch": true,
    "domainRestrictions": {
      "allowlist": null,
      "blocklist": ["example-blocked.com"]
    }
  }
}
```

#### 7.4.2 Knowledge Bases

Proprietary or curated knowledge repositories:

```json
"knowledgeBases": [
  {
    "name": "Product Catalog",
    "description": "Current Home Depot product inventory",
    "type": "proprietary",
    "owner": "The Home Depot, Inc.",
    "realtime": true
  },
  {
    "name": "Installation Guides",
    "description": "How-to guides for home improvement projects",
    "type": "proprietary",
    "owner": "The Home Depot, Inc.",
    "realtime": false,
    "lastUpdated": "2025-12-01"
  }
]
```

#### 7.4.3 Real-Time Feeds

```json
"realtimeFeeds": [
  { "name": "Stock Prices", "provider": "Bloomberg", "type": "financial", "latency": "15-minute delay" },
  { "name": "Weather", "provider": "National Weather Service", "type": "weather", "latency": "real-time" }
]
```

### 7.5 Tools

#### 7.5.1 MCP Servers

Model Context Protocol servers the system connects to:

```json
"tools": {
  "mcpServers": [
    { "name": "filesystem", "description": "Read/write access to user's local files", "permissions": ["read", "write"], "scope": "user-authorized directories only" },
    { "name": "github", "description": "GitHub API access", "permissions": ["read", "write"], "scope": "user-authorized repositories" }
  ]
}
```

#### 7.5.2 External APIs

```json
"externalApis": [
  { "name": "Google Calendar", "description": "Read/write calendar events", "authMethod": "oauth2", "userAuthorization": "required" }
]
```

#### 7.5.3 Compute Capabilities

```json
"compute": {
  "codeExecution": {
    "enabled": true,
    "languages": ["python", "javascript"],
    "sandboxed": true,
    "networkAccess": false
  },
  "fileManipulation": {
    "enabled": true,
    "formats": ["pdf", "docx", "csv", "images"]
  }
}
```

### 7.6 Licensed Content

The `licensedContent` section declares what content this system can access and redistribute. Other agents read this to understand licensing boundaries before sharing information.

#### 7.6.1 Content Partnerships

Formal content licensing agreements:

```json
"licensedContent": {
  "partnerships": [
    {
      "provider": "Reuters",
      "contentType": "news",
      "scope": "Full archive access",
      "redistribution": { "allowed": false, "summaryAllowed": true, "summaryMaxLength": 100 },
      "validUntil": "2026-12-31"
    },
    {
      "provider": "Getty Images",
      "contentType": "images",
      "scope": "Editorial use",
      "redistribution": { "allowed": false, "thumbnailsAllowed": true },
      "validUntil": "2026-06-30"
    }
  ]
}
```

#### 7.6.2 RSL Licenses Held

RSL license tokens the system has acquired for specific content:

```json
"rslLicenses": {
  "held": true,
  "licenseCount": 47,
  "categories": [
    { "type": "news", "publishers": 12, "tier": "ai-training-inference" },
    { "type": "reference", "publishers": 35, "tier": "ai-inference-only" }
  ],
  "verificationEndpoint": "https://api.anthropic.com/rsl/verify"
}
```

#### 7.6.3 Redistribution Rights

What happens when this agent shares licensed content with other agents:

```json
"redistributionPolicy": {
  "default": "no-redistribution",
  "exceptions": [
    { "contentType": "public-domain", "policy": "unrestricted" },
    { "contentType": "creative-commons", "policy": "per-license-terms" }
  ],
  "watermarking": { "enabled": true, "method": "metadata-tag" }
}
```

### 7.7 Content Producer Identification

#### 7.7.1 Design Decision: No Registry

AIMS does not define a content producer registry. Content producers are identified using existing identifiers:

| Identifier Type | Use Case | Example |
|----------------|----------|---------|
| Domain | Web publishers | `nytimes.com` |
| RSL Publisher ID | RSL-participating publishers | `rsl:pub:nytimes` |
| ISNI | Organizations with existing identifiers | `isni:0000000121691048` |
| DOI prefix | Academic publishers | `doi:10.1038` |
| Custom | Proprietary content systems | `homedepot:catalog:v2` |

A global content registry would require ongoing maintenance and governance, create centralization risks, and duplicate work RSL is already doing.

#### 7.7.2 Minimum Viable Producer Reference

For practical use, a content producer reference needs only:

```json
{
  "producer": "nytimes.com",
  "type": "domain"
}
```

The domain is already a globally unique identifier. More sophisticated identification can be layered on through `alternateIdentifiers` when available.

### 7.8 OLP Integration

The Open License Protocol (part of RSL) handles dynamic license negotiation at runtime. AIMS declares static licensing status; OLP handles negotiation.

```json
"olpEndpoint": {
  "url": "https://api.example.com/olp/v1",
  "capabilities": ["query", "acquire"]
}
```

---

## 8. Agent Verification Protocol

When AI agents interact, they need to establish identity and understand each other's capabilities before exchanging sensitive information. This section describes the verification model. Detailed protocol bindings are left for future specification or community contribution.

### 8.1 Overview

The verification process has two phases:

1. **Identity verification:** Confirm the agent is who it claims to be via cryptographic proof tied to its DID
2. **Capability discovery:** Retrieve and validate the agent's manifest to understand its data sources, licensing status, and behavioral constraints

These phases can occur synchronously at connection time or asynchronously depending on trust requirements and latency constraints.

### 8.2 Identity Verification

Identity verification proves that an agent controls the private key associated with its DID (see Section 4.1 for identifier format).

**Conceptual flow:**

1. Agent A initiates connection to Agent B
2. Agent B returns a signed attestation containing: its DID, current timestamp, manifest version hash, and a nonce
3. Agent A resolves Agent B's DID to retrieve the DID Document
4. Agent A verifies the attestation signature against the public key in the DID Document
5. If verification succeeds, identity is established

**Requirements:**

- Verification MUST resist replay attacks (hence timestamp and nonce)
- Verification MUST NOT require a centralized authority at runtime
- Verification SHOULD complete within latency bounds acceptable for interactive use cases
- Failed verification MUST prevent the exchange of sensitive information

### 8.3 Manifest Retrieval

Once identity is verified, the connecting agent retrieves the full manifest to understand capabilities and establish trust boundaries.

1. Check local cache for the counterparty's DID
2. If cached manifest version matches the hash from the attestation, use cached manifest
3. Otherwise, fetch current manifest from the Manifest Store (see Section 4.2)
4. Verify the fetched manifest hash matches the attestation
5. Parse manifest layers as needed (Sections 5, 6, 7)

Caching behavior and TTLs are implementation-dependent but should balance freshness against lookup latency.

### 8.4 Trust Decisions

Manifest contents inform trust decisions. Based on the retrieved manifest, an agent can determine:

- Whether to proceed with the interaction
- What information can be shared (considering licensing constraints in the Capabilities Layer)
- How to handle content with redistribution restrictions
- Whether the counterparty's data sources are relevant to the task

Trust policy is application-specific. AIMS provides the information; agents decide how to act on it.

### 8.5 Protocol Requirements

The verification protocol must satisfy these properties:

| Requirement | Description |
|-------------|-------------|
| **Mutual authentication** | Both parties can verify each other's identity |
| **Replay resistance** | Attestations cannot be reused by attackers |
| **No central dependency** | Verification works without real-time access to a central authority |
| **Graceful degradation** | Agents can define fallback behavior when verification fails or times out |
| **A2A compatibility** | The protocol should integrate with existing A2A authentication flows where possible |

### 8.6 Open Design Questions

The following questions are explicitly left open for community input:

1. **Protocol binding:** Should AIMS define a standalone verification handshake, or specify an extension to A2A's existing authentication mechanism?

2. **Attestation format:** What's the minimal attestation schema? Should it use JWT, Verifiable Presentations, or something simpler?

3. **Partial verification:** Can agents proceed with partial trust (e.g., identity verified but manifest unavailable)? What are the security implications?

4. **Session continuity:** How should verification state persist across multiple interactions? Re-verify per request, per session, or per time window?

5. **Revocation checking:** How do agents learn that a previously-valid DID or manifest has been revoked?

### 8.7 Security Considerations

A full threat model is outside the scope of this draft. However, implementers should consider:

- **Man-in-the-middle:** Attestations should be bound to the transport session
- **Key compromise:** Revocation mechanisms (unspecified) are necessary for production deployments
- **Manifest tampering:** Content-addressed manifests and signed attestations mitigate this, but the trust anchor is the DID Document
- **Denial of service:** Verification should not introduce amplification vectors

---

## 9. Integration with Existing Standards

AIMS complements existing standards rather than replacing them.

### 9.1 W3C Decentralized Identifiers (DIDs)

AIMS uses DIDs as the core identifier for AI systems. The DID specification (W3C Recommendation, July 2022) provides globally unique, cryptographically verifiable identifiers that don't depend on centralized registries. AIMS defines a new DID method (`did:aims`) with resolution semantics specific to AI system manifests.

> **Note:** The full `did:aims` method specification is left for future work.

### 9.2 W3C Verifiable Credentials

AI Manifests can be packaged as Verifiable Credentials (W3C Recommendation, May 2025). This provides:

- Cryptographic signing by the issuing organization
- Selective disclosure of manifest sections
- Revocation and status checking
- Credential chaining for derivative models

### 9.3 Really Simple Licensing (RSL)

RSL (v1.0, November 2025) provides machine-readable licensing terms for web content. AIMS integrates with RSL at two levels:

- The **Foundation Layer** can reference RSL compliance for training data
- The **Capabilities Layer** can declare RSL licenses held for runtime content access

The Open License Protocol (OLP) handles agent-to-agent license negotiation.

### 9.4 Agent-to-Agent Protocol (A2A)

A2A (originally launched by Google in April 2025, now under Linux Foundation governance as of June 2025) standardizes inter-agent communication. AIMS is complementary to A2A, not competitive with it. They solve different problems:

**A2A Agent Card answers: "What can this agent do?"**

The A2A Agent Card (available at `.well-known/agent-card.json`) describes an agent's functional capabilities:

- **Skills**: Specific tasks the agent can perform (e.g., "search the web", "book appointments")
- **Input/Output Modes**: Supported media types (text, JSON, images, audio)
- **Endpoint URL**: Where to reach the agent's A2A service
- **Capabilities**: Protocol features like streaming or push notifications
- **Examples**: Sample prompts for each skill

Example A2A Agent Card:
```json
{
  "name": "Shopping Assistant",
  "skills": [
    {"id": "product_search", "name": "Search products", "inputModes": ["text"]},
    {"id": "price_compare", "name": "Compare prices", "inputModes": ["text"]}
  ],
  "url": "https://api.retailer.com/agent",
  "capabilities": {"streaming": true}
}
```

**AIMS Manifest answers: "What is this agent? Where did it come from? What can it ethically access?"**

The AIMS Manifest describes provenance, transparency, and licensing:

- **Foundation Layer**: Training data sources, licensing status, cryptographic commitments
- **Tuning Layer**: Behavioral alignment, content policies, known biases
- **Capabilities Layer**: Licensed content partnerships, data source access rights, RSL compliance
- **Verification**: Cryptographic identity and manifest integrity

Example scenario showing both:

A user's personal agent connects to a retailer's shopping agent:

1. **A2A handshake** establishes the functional interface:
   - "I offer product search and price comparison skills"
   - "I accept text input and return JSON"

2. **AIMS verification** establishes trust boundaries:
   - "I was trained on retailer product data and public web content"
   - "I have a known bias: recommendations prioritize our products"
   - "I hold licensed access to manufacturer spec sheets and images"
   - "I'm RSL-compliant for web-crawled training data"

The personal agent can now make informed decisions: use the retailer agent's product search skill (A2A), but understand that recommendations are biased toward that retailer (AIMS), and verify that product images are properly licensed (AIMS).

**Integration Points:**

- AIMS verification handshake can slot into A2A's authentication flow
- A2A Agent Card can reference an AIMS Manifest URL for transparency-conscious clients
- Both standards use DIDs for agent identity
- AIMS provides the trust layer A2A needs for sensitive inter-agent collaboration

An agent would typically publish both:
- **Agent Card** at `.well-known/agent-card.json` (A2A)
- **AIMS Manifest** in the Manifest Store, referenced via DID (AIMS)

### 9.5 Model Context Protocol (MCP)

MCP (developed by Anthropic) standardizes how AI systems connect to tools and data sources. The AIMS Capabilities Layer can reference MCP server configurations, making it transparent which MCP tools an AI system can access.

### 9.6 C2PA Content Credentials

The C2PA specification provides content provenance for media assets. AIMS can reference C2PA manifests for training data where available, bridging content-level and system-level provenance. AI-generated content could carry both:

- C2PA credentials (for the output)
- AIMS references (to the generating system)

### 9.7 EU AI Act Compliance

The EU AI Act (Regulation 2024/1689) requires transparency documentation for high-risk AI systems and general-purpose AI models. AIMS manifests can satisfy many of these requirements, particularly:

- Article 11 (technical documentation)
- Article 13 (transparency to deployers)
- Article 53 (obligations for GPAI model providers)

### 9.8 Model Cards

Model Cards (Google Research, 2018) provide a documentation framework for ML models. AIMS manifests are complementary:

- Model Cards are human-readable documentation
- AIMS manifests are machine-readable and cryptographically verifiable

Organizations may publish both.

---

## 10. Core Manifest Schema

The following JSON-LD schema shows how the three layers compose into a complete manifest. This is a draft specification subject to community review.

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://openattribution.org/aims/v1"
  ],
  "@type": "AIManifest",
  "@id": "did:aims:web:anthropic:claude-4-sonnet",
  "version": "2025-12-19T00:00:00Z",
  "previousVersion": "ipfs://bafybeif...",
  "issuer": {
    "@id": "did:web:anthropic.com",
    "name": "Anthropic",
    "verificationMethod": "did:web:anthropic.com#key-1"
  },
  "foundation": { /* See Section 5 */ },
  "tuning": { /* See Section 6 */ },
  "capabilities": { /* See Section 7 */ },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "ecdsa-rdfc-2019",
    "created": "2025-12-19T00:00:00Z",
    "verificationMethod": "did:web:anthropic.com#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "z..."
  }
}
```

### Key Fields

| Field | Description |
|-------|-------------|
| `@context` | JSON-LD context declaring the vocabulary |
| `@type` | Document type (always `AIManifest`) |
| `@id` | The DID of this AI system |
| `version` | ISO-8601 timestamp of this manifest version |
| `previousVersion` | Content-addressed link to prior version (for audit trail) |
| `issuer` | Organization publishing this manifest |
| `foundation` | Training data provenance (Section 5) |
| `tuning` | Behavioral modifications (Section 6) |
| `capabilities` | Runtime access and licensing (Section 7) |
| `proof` | Cryptographic signature over the manifest |

> **Note:** A normative JSON Schema for validation is planned for a future version of this specification.

---

## 11. Use Cases

These examples illustrate how AIMS addresses real-world problems.

### 11.1 Agent-to-Agent Commerce

A user's personal AI assistant helps plan a kitchen renovation by interacting with a home improvement retailer's product recommendation agent.

The user's agent verifies the retailer agent's identity via DID handshake (Section 8.2), then retrieves its manifest (Section 8.3). The manifest confirms:

1. This is the legitimate Home Depot agent
2. It has access to current inventory data
3. Its recommendations may prioritize Home Depot products (a disclosed bias in the Tuning Layer)
4. It holds licenses to specialty content like design guides

The user's agent can now make informed decisions about which recommendations to trust and what information to share.

### 11.2 Content Licensing Transparency

A news publisher wants to verify whether an AI search engine has properly licensed their content for training or inference.

The publisher queries the AI system's manifest to check:

1. Its Foundation Layer RSL compliance attestations
2. Whether the publisher's domain appears in licensed content declarations in the Capabilities Layer
3. Audit endpoints for third-party verification

If no license is present, the publisher has documentation to support licensing discussions or enforcement actions.

### 11.3 Regulatory Compliance

An organization deploying an AI system in the EU needs to demonstrate compliance with AI Act transparency requirements.

The organization retrieves the AI system's AIMS manifest, which provides machine-readable documentation of:

- Training data categories and provenance
- Alignment methodology and content policies
- Capability limitations and known biases
- Version history for audit trails

This manifest can be submitted to regulators as part of conformity assessment, with selective disclosure protecting trade secrets.

### 11.4 Model Derivative Tracking

A company fine-tunes an open-source base model and deploys it as a specialized product assistant.

The derivative model's manifest references the base model's DID in its Foundation Layer (Section 5.5), creating a provenance chain. The Tuning Layer documents the company's fine-tuning data and behavioral modifications. Users interacting with the product assistant can trace its lineage back to the base model while understanding what customizations were applied.

---

## 12. Governance and Adoption

### 12.1 Governance Model

AIMS is designed for multi-stakeholder governance, potentially operating under an established standards body (W3C, Linux Foundation, or similar).

- **Specification Maintenance:** A Technical Steering Committee with representation from AI providers, content publishers, civil society, and academia
- **Registry Operations:** Multiple independent registries can coexist; no single entity controls the manifest store
- **Verification Infrastructure:** Third-party auditors can be accredited to verify manifest claims
- **Dispute Resolution:** Mechanisms for challenging inaccurate manifest claims

### 12.2 Adoption Pathway

**Phase 1: Foundation (2025-2026)**

- Finalize core specification through community review
- Establish reference implementations and test suites
- Initial adoption by founding AI providers
- Integration with RSL and A2A specifications

**Phase 2: Ecosystem (2026-2027)**

- Launch federated manifest registries
- Develop auditor accreditation program
- Browser and platform integration for manifest display
- Tooling for manifest generation and verification

**Phase 3: Maturity (2027+)**

- Regulatory recognition (EU AI Act safe harbor)
- Industry-wide adoption and interoperability
- Content marketplace integration with RSL

---

## 13. Open Questions for Discussion

These questions are explicitly left open for community input. They represent areas where the specification needs further work or where multiple valid approaches exist.

### 13.1 Technical Specification Gaps

1. **DID Method Specification:** The `did:aims` method is referenced but not specified. A complete DID method requires: method-specific identifier syntax, CRUD operations, resolution algorithm, and security considerations.

2. **Merkle Proof Verification:** The Foundation Layer mentions a Merkle root for selective disclosure, but proof generation, format, and verification procedures are not defined.

3. **Revocation:** How do you revoke a manifest? What if a signing key is compromised? What's the revocation distribution mechanism?

### 13.2 Design Tradeoffs

4. **Recursive Provenance:** When AI-generated content becomes training data for new models, how deep should provenance chains extend? What are the practical limits of tracking synthetic data origins?

5. **Verification Granularity:** What level of training data detail should be verifiable? Per-document attribution may be computationally prohibitive. What aggregation levels provide meaningful transparency?

6. **Manifest Freshness:** For dynamic Capabilities Layers, how often should manifests update? What's the right balance between accuracy and caching efficiency?

7. **Trade Secret Protection:** How do we balance transparency with legitimate intellectual property protection? What selective disclosure mechanisms are sufficient for regulatory compliance while preserving competitive advantage?

### 13.3 Ecosystem Questions

8. **Gaming Resistance:** How do we prevent manifest claims from becoming performative compliance rather than genuine transparency? What third-party verification mechanisms are needed?

9. **Liability Allocation:** If an AI system's manifest is inaccurate, who bears liability? The issuing organization? The registry? How do we create appropriate incentives for accuracy?

10. **Transitive Licensing:** If Agent A has a license and summarizes content for Agent B, does the summary inherit licensing restrictions?

11. **Incentive Alignment:** Why would AI providers publish manifests voluntarily before regulation requires it? What's the value proposition for early adopters?

---

## 14. Conclusion

The OpenAttribution AI Manifest Standard provides a framework for AI system transparency: who built this system, what data trained it, how it was aligned, and what it can access at runtime.

This specification is a starting point, not a finished standard. The technical gaps identified in Section 13 are real. The protocol bindings in Section 8 need work. The DID method needs to be written. These are invitations for collaboration, not admissions of failure.

AIMS can enable:

- **Content creators** to understand how their work is used in AI training
- **AI developers** to demonstrate responsible data practices
- **Organizations** to assess AI systems for bias, safety, and regulatory compliance
- **AI agents** to verify each other for secure collaboration
- **Regulators** to audit AI systems with machine-readable documentation

The web needed protocols for identity (DNS), security (TLS), and content (HTTP) to scale. The AI ecosystem needs protocols for provenance, transparency, and trust. AIMS is one proposal for filling that role.

We invite comment, contribution, and critique from AI developers, content publishers, standards bodies, policymakers, and civil society.

---

## Appendix A: Related Standards Reference

| Standard | Organization | Publication | Relevance |
|----------|--------------|-------------|-----------|
| [Decentralized Identifiers (DIDs) v1.0](https://www.w3.org/TR/did-core/) | W3C | July 2022 | Core identifier format |
| [Verifiable Credentials v2.0](https://www.w3.org/TR/vc-data-model-2.0/) | W3C | May 2025 | Manifest signing and packaging |
| [Really Simple Licensing (RSL) v1.0](https://rslstandard.org/rsl) | RSL Collective | November 2025 | Content licensing |
| [Agent-to-Agent Protocol (A2A)](https://github.com/a2aproject/A2A) | Linux Foundation | June 2025 | Inter-agent communication |
| [Model Context Protocol (MCP)](https://modelcontextprotocol.io) | Anthropic | 2024 | Agent-to-tool connectivity |
| [C2PA Content Credentials v2.2](https://c2pa.org/specifications/) | C2PA | Current | Media asset provenance |
| [EU AI Act (2024/1689)](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) | European Union | July 2024 | Regulatory requirements |
| [Model Cards](https://arxiv.org/abs/1810.03993) | Google Research | 2018 | ML model documentation |

---

## Appendix B: Glossary

**AIMS:** OpenAttribution AI Manifest Standard, the specification defined in this document.

**Agent:** An AI system capable of autonomous action and interaction with other systems.

**Capabilities Layer:** Manifest section describing runtime data access and tool integrations (Section 7).

**DID:** Decentralized Identifier, a W3C standard for globally unique, cryptographically verifiable identifiers.

**Fingerprint:** Colloquial term for the AIMS identifier (DID) of an AI system.

**Foundation Layer:** Manifest section describing base model training data provenance (Section 5).

**Manifest:** The complete transparency document for an AI system, comprising Foundation, Tuning, and Capabilities layers.

**Manifest Store:** Registry where AI Manifests are published and retrieved.

**MCP:** Model Context Protocol, a standard for AI-to-tool connectivity developed by Anthropic.

**OLP:** Open License Protocol, part of RSL, for runtime license negotiation between agents.

**RSL:** Really Simple Licensing, a standard for machine-readable content licensing.

**Tuning Layer:** Manifest section describing behavioral modifications applied to the base model (Section 6).

**Verifiable Credential:** A W3C standard for cryptographically signed, tamper-evident digital credentials.
