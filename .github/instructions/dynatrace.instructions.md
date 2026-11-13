# IBM i Naming Standards Recommendation

For future tables, use these label patterns consistently:

| Object  | Label Format | Table Business Name |
|---------|--------------|--------------------|
| ID Columns | <Entity> Identifier | |
| Name Columns | <Entity> Name | |
| Status Columns | <Entity> Status | |
| Timestamps | <Action> Timestamp | |
| Flags | <Purpose> Flag | |

Examples:

```text
RULE_ID -> Rule Identifier
COLLECTOR_ID -> Collector Identifier
ALERT_ID -> Alert Identifier
CREATED_TS -> Created Timestamp
UPDATED_TS -> Updated Timestamp
ENABLED -> Enabled Flag
ACTIVE -> Active Indicator
```

This convention scales cleanly when you add the Sprint 2 tables:

- DYN_METRIC_STAGE
- DYN_WORK_QUEUE
- DYN_ALERT
- DYN_THRESHOLD
- DYN_NOTIFICATION_PROFILE
- DYN_NOTIFICATION_RECIPIENT
- DYN_TRANSMISSION_LOG

and keeps ACS, SQL catalogs, and generated documentation consistent.