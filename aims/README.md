# OpenAttribution AI Manifest Standard (AIMS)

**An Open Standard for AI System Transparency, Provenance, and Agent-to-Agent Trust**

Incomplete Draft Specification v0.1 | December 2025

> **Note on Completeness:** This specification is complete for content usage transparency and training data licensing provenance. Sections requiring cryptographic expertise (DID method specification, Merkle proof formats, verification protocol bindings) require expert contribution.

---

## What is AIMS?

AIMS is a focused standard for **AI training data licensing provenance, runtime content access rights, and agent-to-agent cryptographic trust**. While Model Cards document performance and Dataset Cards document composition, AIMS answers the licensing questions they don't address:

- **Training Data Licensing Provenance** — What's the licensing status of the training data? Can it be proven?
- **Runtime Content Access Rights** — What content can the system legally access during inference?
- **Agent-to-Agent Trust** — How do AI agents cryptographically verify each other's identity and licensing boundaries?

AIMS builds on W3C standards (DIDs, Verifiable Credentials) and works alongside Model Cards, Dataset Cards, A2A Agent Cards, and MCP for comprehensive AI transparency.

## Specification

The full specification is available in [SPECIFICATION.md](SPECIFICATION.md).

### Key Sections

| Section | Description |
|---------|-------------|
| [Executive Summary](SPECIFICATION.md#1-executive-summary) | Overview of AIMS focused scope |
| [Problem Statement](SPECIFICATION.md#2-problem-statement) | Licensing and provenance gaps AIMS addresses |
| [Architecture](SPECIFICATION.md#4-architecture-overview) | Core components |
| [Foundation Layer](SPECIFICATION.md#5-foundation-layer-specification) | Training data licensing provenance |
| [Deployment Context Layer](SPECIFICATION.md#6-deployment-context-layer-specification) | Commercial and operational biases |
| [Content Access Layer](SPECIFICATION.md#7-content-access-layer-specification) | Runtime content access rights and licensing |
| [Verification Protocol](SPECIFICATION.md#8-agent-verification-protocol) | Cryptographic agent identity verification |
| [Integration with Standards](SPECIFICATION.md#9-integration-with-existing-standards) | How AIMS relates to Model Cards, Dataset Cards, A2A, MCP |
| [Open Questions](SPECIFICATION.md#13-open-questions-for-discussion) | Areas needing community input |

### Supporting Materials

- [How AIMS Relates to Other Standards](SPECIFICATION.md#appendix-a-how-aims-relates-to-other-standards) - RSL, A2A, MCP, Model Cards, Dataset Cards
- [AIMS Scope Boundaries](SPECIFICATION.md#appendix-d-aims-scope-boundaries) - What AIMS covers vs other standards
- [Related Standards](SPECIFICATION.md#appendix-b-related-standards-reference)
- [Glossary](SPECIFICATION.md#appendix-c-glossary)
- [Example Manifest](examples/example-manifest.json)

## Status

This is an **incomplete draft specification** intended to invite collaboration.

**Complete:** Content usage transparency, training data licensing provenance, commercial bias disclosure

**Requires expert contribution:**

- DID method specification (`did:aims`)
- Verification protocol bindings
- Merkle proof format for selective disclosure
- Cryptographic signature schemes

See [Open Questions](SPECIFICATION.md#13-open-questions-for-discussion) for the full list.

## Contributing

We welcome contributions from:

- AI developers and providers
- Content publishers
- Standards bodies
- Policymakers
- Civil society organizations

To contribute:

1. Open an issue to discuss proposed changes
2. Submit a pull request with your contribution
3. Join the discussion in existing issues

## License

[TBD — suggest Apache 2.0 or CC-BY for the spec text]

## About OpenAttribution

OpenAttribution is a coalition of publishers, brands, and technology providers developing standards for content licensing and AI transparency.
