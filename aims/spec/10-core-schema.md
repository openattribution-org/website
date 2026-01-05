---
layout: spec
title: "Core Schema Reference"
section: true
prev:
  title: "Integration with RSL and A2A"
  url: "spec/09-integration.html"
next:
  title: "Use Cases and Examples"
  url: "spec/11-use-cases.html"
---

# 10. Core Manifest Schema

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
  "foundation": {
    /* See Section 5 */
  },
  "tuning": {
    /* See Section 6 */
  },
  "capabilities": {
    /* See Section 7 */
  },
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

## Key Fields

| Field | Description |
|-------|-------------|
| `@context` | JSON-LD context declaring the vocabulary |
| `@type` | Document type (always `AIManifest`) |
| `@id` | The DID of this AI system |
| `version` | ISO-8601 timestamp of this manifest version |
| `previousVersion` | Content-addressed link to prior version (for audit trail) |
| `issuer` | Organization publishing this manifest |
| `foundation` | Training data provenance ([Section 5](05-foundation-layer.md)) |
| `tuning` | Behavioral modifications ([Section 6](06-tuning-layer.md)) |
| `capabilities` | Runtime access and licensing ([Section 7](07-capabilities-layer.md)) |
| `proof` | Cryptographic signature over the manifest |

## Versioning

Manifests are versioned with ISO-8601 timestamps. The `previousVersion` field creates a linked list of historical manifests, enabling:

- Audit trails
- Change detection
- Historical queries ("what could this system access on date X?")

## Signing

The `proof` field contains a Data Integrity Proof per the W3C specification. This provides:

- Integrity verification (tamper detection)
- Issuer authentication (who published this manifest)
- Non-repudiation (issuer cannot deny publishing)

> **Note:** A normative JSON Schema for validation is planned for a future version of this specification.

---

Previous: [Integration](09-integration.md) | Next: [Use Cases](11-use-cases.md)
