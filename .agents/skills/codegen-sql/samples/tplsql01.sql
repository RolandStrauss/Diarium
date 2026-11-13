-- <Metadata>
-- Source Name .........: TPLSQL01
-- Created By ...........: R. Strauss
-- Date Created .........: 2026-08-28
-- Source Description ..: Generic SQL scaffold for IBM i RUNSQLSTM workflows.
-- Jira ..................: N/A
-- </Metadata>
--
-- <Synopsis>
-- Minimal SQL member with schema setup, timestamp value, and health-check query.
-- </Synopsis>
--
-- <Revision History>
-- Revisioner | Date | Jira No (if known) | Change |
-- R. Strauss | 2026-08-28 | N/A | Initial scaffold |
-- </Revision History>
--
-- Generic SQL member scaffold
set current schema = 'MMDEVOPS';


-- Keep member statements separated with STOP for RUNSQLSTM workflows.
stop;


values
  current timestamp;


stop;


select
  1 as tplsql01_health
from
  SYSIBM.SYSDUMMY1;


stop;
