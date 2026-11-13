/* <Metadata> */
/* Source Name .........: TPLCL02 */
/* Created By ...........: R. Strauss */
/* Date Created .........: 2026-08-28 */
/* Source Description ..: CLP compatibility scaffold for IBM i command flow. */
/* Jira ..................: N/A */
/* </Metadata> */
/* */
/* <Synopsis> */
/* Minimal CLP scaffold with validation and deterministic completion path. */
/* </Synopsis> */
/* */
/* <Revision History> */
/* Revisioner | Date | Jira No (if known) | Change | */
/* R. Strauss | 2026-08-28 | N/A | Initial scaffold | */
/* </Revision History> */

PGM PARM(&REQUEST)

				DCL VAR(&REQUEST) TYPE(*CHAR) LEN(132)
				DCL VAR(&MSG) TYPE(*CHAR) LEN(256) VALUE('')

				MONMSG MSGID(CPF0000) EXEC(DO)
					SNDPGMMSG MSG('TPLCL02 failed. Review joblog.') TOPGMQ(*EXT) MSGTYPE(*ESCAPE)
				ENDDO

/* Initialise */
				CHGVAR VAR(&REQUEST) VALUE(%TRIM(&REQUEST))

/* Input + Process */
				IF COND(%LEN(&REQUEST) *EQ 0) THEN(DO)
					CHGVAR VAR(&MSG) VALUE('REQUEST cannot be blank.')
				ENDDO

/* Output */
				IF COND(%TRIM(&MSG) *EQ '') THEN(DO)
					SNDPGMMSG MSG('TPLCL02 started') TOPGMQ(*PRV) MSGTYPE(*INFO)
					RETURN
				ENDDO

				SNDPGMMSG MSG(%TRIM(&MSG)) TOPGMQ(*EXT) MSGTYPE(*ESCAPE)

ENDPGM
