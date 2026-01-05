---
layout: spec
title: "Verification Protocol"
section: true
prev:
  title: "Capabilities Layer"
  url: "spec/07-capabilities-layer.html"
next:
  title: "Integration with RSL and A2A"
  url: "spec/09-integration.html"
---

# 8. Agent Verification Protocol

When AI agents interact, they need to establish identity and understand each other's capabilities before exchanging sensitive information. This section describes the verification model. Detailed protocol bindings are left for future specification or community contribution.

## 8.1 Overview

The verification process has two phases:

1. **Identity verification:** Confirm the agent is who it claims to be via cryptographic proof tied to its DID
2. **Capability discovery:** Retrieve and validate the agent's manifest to understand its data sources, licensing status, and behavioral constraints

These phases can occur synchronously at connection time or asynchronously depending on trust requirements and latency constraints.

## 8.2 Identity Verification

Identity verification proves that an agent controls the private key associated with its DID (see [Section 4.1](04-architecture.md#41-ai-system-identifier-fingerprint) for identifier format).

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

## 8.3 Manifest Retrieval

Once identity is verified, the connecting agent retrieves the full manifest to understand capabilities and establish trust boundaries.

1. Check local cache for the counterparty's DID
2. If cached manifest version matches the hash from the attestation, use cached manifest
3. Otherwise, fetch current manifest from the Manifest Store (see [Section 4.2](04-architecture.md#42-manifest-store))
4. Verify the fetched manifest hash matches the attestation
5. Parse manifest layers as needed ([Section 5](05-foundation-layer.md), [Section 6](06-tuning-layer.md), [Section 7](07-capabilities-layer.md))

Caching behavior and TTLs are implementation-dependent but should balance freshness against lookup latency.

## 8.4 Trust Decisions

Manifest contents inform trust decisions. Based on the retrieved manifest, an agent can determine:

- Whether to proceed with the interaction
- What information can be shared (considering licensing constraints in the Capabilities Layer)
- How to handle content with redistribution restrictions
- Whether the counterparty's data sources are relevant to the task

Trust policy is application-specific. AIMS provides the information; agents decide how to act on it.

## 8.5 Protocol Requirements

The verification protocol must satisfy these properties:

| Requirement | Description |
|-------------|-------------|
| **Mutual authentication** | Both parties can verify each other's identity |
| **Replay resistance** | Attestations cannot be reused by attackers |
| **No central dependency** | Verification works without real-time access to a central authority |
| **Graceful degradation** | Agents can define fallback behavior when verification fails or times out |
| **A2A compatibility** | The protocol should integrate with existing A2A authentication flows where possible |

## 8.6 Open Design Questions

The following questions are explicitly left open for community input:

1. **Protocol binding:** Should AIMS define a standalone verification handshake, or specify an extension to A2A's existing authentication mechanism?

2. **Attestation format:** What's the minimal attestation schema? Should it use JWT, Verifiable Presentations, or something simpler?

3. **Partial verification:** Can agents proceed with partial trust (e.g., identity verified but manifest unavailable)? What are the security implications?

4. **Session continuity:** How should verification state persist across multiple interactions? Re-verify per request, per session, or per time window?

5. **Revocation checking:** How do agents learn that a previously-valid DID or manifest has been revoked?

## 8.7 Security Considerations

A full threat model is outside the scope of this draft. However, implementers should consider:

- **Man-in-the-middle:** Attestations should be bound to the transport session
- **Key compromise:** Revocation mechanisms (unspecified) are necessary for production deployments
- **Manifest tampering:** Content-addressed manifests and signed attestations mitigate this, but the trust anchor is the DID Document
- **Denial of service:** Verification should not introduce amplification vectors

---

Previous: [Capabilities Layer](07-capabilities-layer.md) | Next: [Integration with Existing Standards](09-integration.md)
