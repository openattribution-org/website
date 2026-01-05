---
layout: spec
title: "Use Cases and Examples"
section: true
prev:
  title: "Core Schema Reference"
  url: "spec/10-core-schema.html"
next:
  title: "Governance and Evolution"
  url: "spec/12-governance.html"
---

# 11. Use Cases

These examples illustrate how AIMS addresses real-world problems.

## 11.1 Agent-to-Agent Commerce

A user's personal AI assistant helps plan a kitchen renovation by interacting with a home improvement retailer's product recommendation agent.

The user's agent verifies the retailer agent's identity via DID handshake ([Section 8.2](08-verification-protocol.md#82-identity-verification)), then retrieves its manifest ([Section 8.3](08-verification-protocol.md#83-manifest-retrieval)). The manifest confirms:

1. This is the legitimate Home Depot agent
2. It has access to current inventory data
3. Its recommendations may prioritize Home Depot products (a disclosed bias in the Tuning Layer)
4. It holds licenses to specialty content like design guides

The user's agent can now make informed decisions about which recommendations to trust and what information to share.

## 11.2 Content Licensing Transparency

A news publisher wants to verify whether an AI search engine has properly licensed their content for training or inference.

The publisher queries the AI system's manifest to check:

1. Its Foundation Layer RSL compliance attestations
2. Whether the publisher's domain appears in licensed content declarations in the Capabilities Layer
3. Audit endpoints for third-party verification

If no license is present, the publisher has documentation to support licensing discussions or enforcement actions.

## 11.3 Regulatory Compliance

An organization deploying an AI system in the EU needs to demonstrate compliance with AI Act transparency requirements.

The organization retrieves the AI system's AIMS manifest, which provides machine-readable documentation of:

- Training data categories and provenance
- Alignment methodology and content policies
- Capability limitations and known biases
- Version history for audit trails

This manifest can be submitted to regulators as part of conformity assessment, with selective disclosure protecting trade secrets.

## 11.4 Model Derivative Tracking

A company fine-tunes an open-source base model and deploys it as a specialized product assistant.

The derivative model's manifest references the base model's DID in its Foundation Layer ([Section 5.5](05-foundation-layer.md#55-derivative-models)), creating a provenance chain. The Tuning Layer documents the company's fine-tuning data and behavioral modifications. Users interacting with the product assistant can trace its lineage back to the base model while understanding what customizations were applied.

---

Previous: [Core Schema](10-core-schema.md) | Next: [Governance and Adoption](12-governance.md)
