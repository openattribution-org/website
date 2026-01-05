---
layout: spec
title: "Open Questions"
section: true
prev:
  title: "Governance and Evolution"
  url: "spec/12-governance.html"
next:
  title: "Conclusion"
  url: "spec/14-conclusion.html"
---

# 13. Open Questions for Discussion

These questions are explicitly left open for community input. They represent areas where the specification needs further work or where multiple valid approaches exist.

## 13.1 Technical Specification Gaps

1. **DID Method Specification:** The `did:aims` method is referenced but not specified. A complete DID method requires: method-specific identifier syntax, CRUD operations, resolution algorithm, and security considerations.

2. **Merkle Proof Verification:** The Foundation Layer mentions a Merkle root for selective disclosure, but proof generation, format, and verification procedures are not defined.

3. **Revocation:** How do you revoke a manifest? What if a signing key is compromised? What's the revocation distribution mechanism?

## 13.2 Design Tradeoffs

4. **Recursive Provenance:** When AI-generated content becomes training data for new models, how deep should provenance chains extend? What are the practical limits of tracking synthetic data origins?

5. **Verification Granularity:** What level of training data detail should be verifiable? Per-document attribution may be computationally prohibitive. What aggregation levels provide meaningful transparency?

6. **Manifest Freshness:** For dynamic Capabilities Layers, how often should manifests update? What's the right balance between accuracy and caching efficiency?

7. **Trade Secret Protection:** How do we balance transparency with legitimate intellectual property protection? What selective disclosure mechanisms are sufficient for regulatory compliance while preserving competitive advantage?

## 13.3 Ecosystem Questions

8. **Gaming Resistance:** How do we prevent manifest claims from becoming performative compliance rather than genuine transparency? What third-party verification mechanisms are needed?

9. **Liability Allocation:** If an AI system's manifest is inaccurate, who bears liability? The issuing organization? The registry? How do we create appropriate incentives for accuracy?

10. **Transitive Licensing:** If Agent A has a license and summarizes content for Agent B, does the summary inherit licensing restrictions?

11. **Incentive Alignment:** Why would AI providers publish manifests voluntarily before regulation requires it? What's the value proposition for early adopters?

---

Previous: [Governance](12-governance.md) | Next: [Conclusion](14-conclusion.md)
