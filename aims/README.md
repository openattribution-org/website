# OpenAttribution AI Manifest Standard (AIMS)

**An Open Standard for AI System Transparency, Provenance, and Agent-to-Agent Trust**

Draft Specification v0.1 | December 2025

---

## What is AIMS?

AIMS is an open, interoperable framework for declaring and verifying the provenance, capabilities, and data sources of AI systems. It provides:

- **Training Data Transparency** — Where did the model's training data come from?
- **Tuning and Alignment Disclosure** — What behavioral modifications were applied?
- **Runtime Capabilities** — What tools and licensed content can the system access?

AIMS builds on W3C standards (DIDs, Verifiable Credentials) and integrates with RSL for content licensing and A2A for agent communication.

## Specification

The full specification is available in [SPECIFICATION.md](SPECIFICATION.md).

### Key Sections

| Section | Description |
|---------|-------------|
| [Executive Summary](SPECIFICATION.md#1-executive-summary) | Overview of AIMS |
| [Problem Statement](SPECIFICATION.md#2-problem-statement) | What problems AIMS solves |
| [Architecture](SPECIFICATION.md#4-architecture-overview) | Core components |
| [Foundation Layer](SPECIFICATION.md#5-foundation-layer-specification) | Training data provenance |
| [Tuning Layer](SPECIFICATION.md#6-tuning-layer-specification) | Behavioral modifications |
| [Capabilities Layer](SPECIFICATION.md#7-capabilities-layer-specification) | Runtime access and licensing |
| [Verification Protocol](SPECIFICATION.md#8-agent-verification-protocol) | Agent-to-agent trust |
| [Open Questions](SPECIFICATION.md#13-open-questions-for-discussion) | Areas needing community input |

### Supporting Materials

- [Related Standards](SPECIFICATION.md#appendix-a-related-standards-reference)
- [Glossary](SPECIFICATION.md#appendix-b-glossary)
- [Example Manifest](examples/example-manifest.json)

## Status

This is a **draft specification** intended to invite collaboration. Key areas explicitly left open for community input include:

- DID method specification (`did:aims`)
- Verification protocol bindings
- Merkle proof format for selective disclosure
- Conformance levels and testing

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

OpenAttribution is a coalition of publishers, brands, and technology providers developing trust infrastructure for the agentic AI ecosystem.
