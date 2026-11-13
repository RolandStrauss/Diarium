/* <Metadata> */
/* Source Name .........: TPLCL03 */
/* Created By ...........: R. Strauss */
/* Date Created .........: 2026-08-28 */
/* Source Description ..: Generic CL scaffold for IBM i control flow. */
/* Jira ..................: N/A */
/* </Metadata> */
/* */
/* <Synopsis> */
/* Minimal CL scaffold with deterministic process and output branches. */
/* </Synopsis> */
/* */
/* <Revision History> */
/* Revisioner | Date | Jira No (if known) | Change | */
/* R. Strauss | 2026-08-28 | N/A | Initial scaffold | */
/* </Revision History> */

PGM

        DCL VAR(&MSG) TYPE(*CHAR) LEN(256) VALUE('')

        MONMSG MSGID(CPF0000) EXEC(DO)
          SNDPGMMSG MSG('TPLCL03 failed. Review joblog.') TOPGMQ(*EXT) MSGTYPE(*ESCAPE)
        ENDDO

/* Initialise */
        CHGVAR VAR(&MSG) VALUE('')

/* Process */
        IF COND(%TRIM(&MSG) *EQ '') THEN(DO)
          SNDPGMMSG MSG('TPLCL03 generic CL scaffold') TOPGMQ(*PRV) MSGTYPE(*INFO)
          RETURN
        ENDDO

/* Output */
        SNDPGMMSG MSG(%TRIM(&MSG)) TOPGMQ(*EXT) MSGTYPE(*ESCAPE)

ENDPGM
