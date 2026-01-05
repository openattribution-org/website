---
layout: spec
title: "Executive Summary"
section: true
next:
  title: "Problem Statement"
  url: "spec/02-problem-statement.html"
---

# 1. Executive Summary

The OpenAttribution AI Manifest Standard (AIMS) is an open, interoperable framework for declaring and verifying the provenance, capabilities, and data sources of large language models and the AI systems built on top of them. AI agents now routinely interact with each other and with content across the web. A standardized transparency and attribution framework has become necessary.

This specification tackles three problems:

1. **Training Data Transparency:** Where did the base model's training data come from? What's its licensing status? What biases might be baked in?

2. **Tuning and Alignment Disclosure:** What behavioral modifications, value alignments, and content policies were applied through fine-tuning and system prompting?

3. **Runtime Capabilities:** What data sources, tools, and licensed content can an AI system access during inference? How can agents verify this about each other?

AIMS builds on established W3C standards including Decentralized Identifiers (DIDs) and Verifiable Credentials. It integrates with Really Simple Licensing (RSL) for content rights and the Agent-to-Agent (A2A) protocol for inter-agent communication. OpenAttribution, a coalition of publishers, brands, and technology providers, developed this specification to provide a trust layer for the agentic AI ecosystem.

---

Next: [Problem Statement](02-problem-statement.md)
