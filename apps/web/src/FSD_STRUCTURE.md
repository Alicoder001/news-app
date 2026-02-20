# Frontend FSD Structure

## Layers
- `app`: Next.js routing, layouts, providers bootstrap.
- `shared`: reusable infra (query provider, utils, config).
- `entities`: domain entities and typed API contracts per entity.
- `features`: user-facing behaviors and business interactions.
- `widgets`: page-level composition blocks.

## Migration Notes
- Legacy `src/components/*` kept as compatibility re-export surface.
- New development target:
  - `src/widgets/*`
  - `src/features/*`
  - `src/entities/*`
  - `src/shared/*`
