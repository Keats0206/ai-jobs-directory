---
license: cc-by-4.0
language:
- en
pretty_name: micro1 Pay Index
size_categories:
- n<1K
tags:
- labor-market
- ai-training
- rlhf
- pay
- micro1
configs:
- config_name: default
  data_files: "data/*.csv"
---

# micro1 Pay Index

Monthly snapshot of advertised hourly pay for AI training roles on micro1, by field. One row per field per edition, plus an `all` row for every field combined.

**October 2026 (snapshot 2026-10-24):** 270 open hourly roles; median posted range $50–$90/hr. Highest-paying fields by median top rate: Science & Research ($200/hr), Law ($170/hr), Finance ($150/hr). Highest posted rate: $400/hr.

## Columns

| Column | Meaning |
|---|---|
| `edition` | Edition month, `YYYY-MM` |
| `snapshot_date` | Date the listings were read |
| `field_slug`, `field` | Field of work (`all` = every field) |
| `roles` | Open roles in the field |
| `hourly_roles` | Roles that post an hourly range |
| `median_low_usd_hr` | Median bottom of the posted range, USD/hr |
| `median_high_usd_hr` | Median top of the posted range, USD/hr |
| `p90_high_usd_hr` | 90th percentile top of range, USD/hr (blank for small samples) |
| `max_high_usd_hr` | Highest posted rate, USD/hr |
| `high_demand_roles` | Roles micro1 marks as high demand |

## Limits

These are advertised ranges from micro1's public board, not earnings or contract rates. Only micro1 is covered. Fields with fewer than 5 roles are small samples.

## Source

Methodology and the full edition: https://www.artificialjobs.dev/pay-index/2026-10#methodology

## Citation

Artificial Jobs, *micro1 Pay Index, October 2026*. https://www.artificialjobs.dev/pay-index/2026-10. CC BY 4.0.
