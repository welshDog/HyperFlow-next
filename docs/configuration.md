# Configuration & Hyper Super Powers

Hyperflow Editor uses a robust configuration system based on environment variables validated by Zod. This system, affectionately known as "Hyper Super Powers", allows for fine-grained control over features, performance budgets, and security guardrails.

## Core Environment

These variables are required for the application to function.

| Variable | Description | Required? | Default (Dev) |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | Postgres connection string | Yes | `postgresql://...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | Yes | `https://project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | Yes | `test-key` |

## Hyper Super Powers (Feature Flags)

These flags control the behavior and features of the application. They can be toggled via environment variables.

### General Features
| Variable | Description | Default |
| :--- | :--- | :--- |
| `HYPER_ENABLE_POWERS` | Master switch for all powers | `true` |
| `HYPER_ENABLE_VERSIONING` | Enable version history/restore | `true` |
| `HYPER_ENABLE_MINIMAP` | Show minimap on canvas | `true` |
| `HYPER_ENABLE_TOASTS` | Show toast notifications | `true` |
| `HYPER_ENABLE_AUTH_GUARDS` | Enforce RBAC checks | `true` |
| `HYPER_ENABLE_MONITORING` | Enable performance monitoring | `true` |

### System Safety
| Variable | Description | Default |
| :--- | :--- | :--- |
| `HYPER_KILL_SWITCH` | Emergency disable for the app | `false` |
| `HYPER_SAFE_MODE` | Enable extra safety checks | `false` |
| `HYPER_ROLLBACK_ON_FAILURE` | Auto-rollback flows on error | `true` |
| `HYPER_AUTH_REQUIRED_FOR_RESTORE` | Require auth to restore versions | `true` |

### Performance Budgets
| Variable | Description | Default |
| :--- | :--- | :--- |
| `HYPER_PERF_BUDGET_LCP_MS` | Max LCP time (ms) | `2500` |
| `HYPER_PERF_BUDGET_CLS` | Max CLS score | `0.1` |
| `HYPER_PERF_BUDGET_TTI_MS` | Max TTI time (ms) | `5000` |
| `HYPER_MAX_CONCURRENCY` | Max concurrent operations | `4` |

### Administrative
| Variable | Description | Default |
| :--- | :--- | :--- |
| `HYPER_ALLOW_BULK_EXPORT` | Allow bulk data export | `false` |
| `HYPER_ALLOW_SYSTEM_CONFIG` | Allow system config changes | `false` |
| `HYPER_ALLOW_USER_MANAGEMENT` | Allow user management | `false` |
| `HYPER_LOG_LEVEL` | Logging verbosity | `info` |
| `HYPER_DEBUG_FEATURES` | Enable debug tools | `false` |
| `HYPER_MESSAGE_SECRET` | Internal message signing key | `dev-secret` |

## Docker Configuration

When running via Docker Compose, the application is pre-configured to connect to the HyperCode ecosystem:

- **Network**: `hypercode_data_net` (Backend/DB), `hypercode_frontend_net` (Frontend)
- **Port**: Exposed on `3002` by default.
- **Hostname**: Binds to `0.0.0.0` for container compatibility.
