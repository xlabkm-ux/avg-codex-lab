# Graph Model

The graph represents a working map, not Reality.

## Core Node Types

- `Term`
- `Claim`
- `Concept`
- `Map`
- `Risk`
- `SourceFragment`
- `Mode`
- `Artifact`

## Core Edge Types

- `DEFINES`
- `SUPPORTS`
- `CONTRADICTS`
- `DEPENDS_ON`
- `CONTAINS`
- `MANIFESTS_AS`
- `RISKS`
- `REPAIRS`
- `CITES`

## Required Node Fields

Every important node must have:

```json
{
  "id": "...",
  "type": "...",
  "label": "...",
  "definition": "...",
  "coordinates": {
    "access_mode": "knowable | indirectly_accessible | unknowable | mixed",
    "language_mode": "direct_description | operational_description | conditional_description | metaphor | symbolic_pointer",
    "claim_status": "definition | working_distinction | hypothesis | metaphor_only | prohibited_positive_claim"
  },
  "map_safety": {
    "known_risks": []
  }
}
```

## Graph Rule

A node without coordinates is not allowed in production graph storage.
