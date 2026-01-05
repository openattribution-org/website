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

The full specification is available as:

- [Single document](SPECIFICATION.md) — Complete spec in one file
- [Section-by-section](spec/) — Individual files for each section

### Quick Links

| Section | Description |
|---------|-------------|
| [Executive Summary](spec/01-executive-summary.md) | Overview of AIMS |
| [Problem Statement](spec/02-problem-statement.md) | What problems AIMS solves |
| [Architecture](spec/04-architecture.md) | Core components |
| [Foundation Layer](spec/05-foundation-layer.md) | Training data provenance |
| [Tuning Layer](spec/06-tuning-layer.md) | Behavioral modifications |
| [Capabilities Layer](spec/07-capabilities-layer.md) | Runtime access and licensing |
| [Verification Protocol](spec/08-verification-protocol.md) | Agent-to-agent trust |
| [Open Questions](spec/13-open-questions.md) | Areas needing community input |

### Supporting Materials

- [Related Standards](appendices/related-standards.md)
- [Glossary](appendices/glossary.md)
- [Example Manifest](examples/example-manifest.json)

## Status

This is a **draft specification** intended to invite collaboration. Key areas explicitly left open for community input include:

- DID method specification (`did:aims`)
- Verification protocol bindings
- Merkle proof format for selective disclosure
- Conformance levels and testing

See [Open Questions](spec/13-open-questions.md) for the full list.

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
