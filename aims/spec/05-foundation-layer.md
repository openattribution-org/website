---
layout: spec
title: "Foundation Layer"
section: true
prev:
  title: "Architecture Overview"
  url: "spec/04-architecture.html"
next:
  title: "Tuning Layer"
  url: "spec/06-tuning-layer.html"
---

# 5. Foundation Layer Specification

The Foundation Layer documents where a base model's training data came from. Modern LLMs train on billions of documents, so this layer uses hierarchical abstraction: high-level summaries for public disclosure, cryptographic commitments for selective verification by auditors.

*Core question: What went into building this model?*

## 5.1 Schema Structure

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

## 5.2 Training Data Summary

High-level categorical breakdown for public disclosure. End users and basic integrations will see this.

### 5.2.1 Data Categories

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

```json
"categories": {
  "webCrawl": 0.45,
  "books": 0.15,
  "code": 0.12,
  "academic": 0.08,
  "licensedDatasets": 0.10,
  "syntheticData": 0.05,
  "conversational": 0.03,
  "other": 0.02
}
```

### 5.2.2 Temporal Distribution

Date ranges of source content creation or publication:

```json
"temporalRange": {
  "earliest": "1900-01-01",
  "latest": "2025-06-01",
  "medianDate": "2019-03-15"
}
```

### 5.2.3 Language Distribution

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

### 5.2.4 Domain Coverage

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

## 5.3 Cryptographic Commitments

Detailed provenance that can't be fully disclosed publicly but must remain verifiable.

### 5.3.1 Merkle Root

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

### 5.3.2 Audit Endpoint

URL for authorized third-party auditors to verify detailed provenance claims. Access requires authentication and audit agreements.

```json
"auditEndpoint": {
  "url": "https://api.anthropic.com/aims/audit/v1",
  "authMethod": "oauth2",
  "auditorRequirements": "https://anthropic.com/aims-auditor-program"
}
```

## 5.4 RSL Compliance

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

### 5.4.1 Licensing Summary

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

## 5.5 Derivative Models

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

Previous: [Architecture](04-architecture.md) | Next: [Tuning Layer](06-tuning-layer.md)
