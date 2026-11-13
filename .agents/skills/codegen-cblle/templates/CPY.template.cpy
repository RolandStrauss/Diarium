            *> <Metadata>
            *> Source Name .........: COPYBOOK_NAME
            *> Created By ...........: R. Strauss
            *> Date Created .........: 2026-08-18
            *> Source Description ..: COBOL copybook scaffold for shared structures.
            *> Jira ..................: N/A
            *> </Metadata>
            *>
            *> <Synopsis>
            *> Declaration-only copybook for API context and operation result fields.
            *> </Synopsis>
            *>
            *> <Revision History>
            *> Revisioner | Date | Jira No (if known) | Change |
            *> R. Strauss | 2026-08-28 | N/A | Initial scaffold |
            *> </Revision History>

       01  API-CONTEXT.
           05  API-REQUEST-ID        PIC X(36).
           05  API-USER              PIC X(18).
           05  API-TIMESTAMP         PIC X(26).

       01  API-RESULT.
           05  API-STATUS-CODE       PIC S9(5) COMP-5.
           05  API-STATUS-MESSAGE    PIC X(256).
