# AIMS - AI Manifest Standard

**Licensing provenance, runtime access rights, and agent-to-agent trust for AI systems.**

Part of the [OpenAttribution](https://openattribution.org) project.

---

## Specification

The authoritative AIMS specification is maintained in the SDK repository:

**[github.com/openattribution-org/aims/SPECIFICATION.md](https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md)**

---

## Quick Start

```bash
pip install openattribution-aims
```

```python
from openattribution.aims import AIManifest
from openattribution.aims.layers import FoundationLayer, ContentAccessLayer

manifest = AIManifest(
    did="did:aims:web:example.com:shopping-assistant",
    foundation=FoundationLayer(
        training_datasets=["dataset:openwebtext"],
        rsl_compliance=True,
    ),
    content_access=ContentAccessLayer(
        licensed_sources=["source:wirecutter", "source:rtings"],
        redistribution_policy="summary_only",
    ),
)
```

---

## Three-Layer Model

| Layer | Purpose | Key Fields |
|-------|---------|------------|
| **Foundation** | Training data provenance | datasets, RSL compliance, Merkle commitments |
| **Deployment** | Commercial context | brand affiliations, biases, specialization |
| **Content Access** | Runtime rights | licensed sources, redistribution policy |

---

## Resources

- **SDK Repository**: [github.com/openattribution-org/aims](https://github.com/openattribution-org/aims)
- **Full Specification**: [SPECIFICATION.md](https://github.com/openattribution-org/aims/blob/main/SPECIFICATION.md)
- **PyPI**: [openattribution-aims](https://pypi.org/project/openattribution-aims/)

---

## License

Apache 2.0
