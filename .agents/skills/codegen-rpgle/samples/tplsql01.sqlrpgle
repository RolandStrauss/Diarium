**free
// <Metadata>
// Source Name .........: TPLSQL01
// Created By ...........: R. Strauss
// Date Created .........: 2026-08-28
// Source Description ..: Free-format SQLRPGLE scaffold with SQLSTATE handling.
// Jira ..................: N/A
// </Metadata>
//
// <Synopsis>
// Minimal SQLRPGLE program with setup, lookup, and no-data/error handling.
// </Synopsis>
//
// <Revision History>
// Revisioner | Date | Jira No (if known) | Change |
// R. Strauss | 2026-08-28 | N/A | Initial scaffold |
// </Revision History>

ctl-opt main(mainSql)
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*new)
        commit(*none)
        alwnull(*usrctl);

/INCLUDE 'qrpglesrc/sqlca.rpgleinc'

dcl-c SQLSTATE_OK                 const('00000');
dcl-c SQLSTATE_NO_DATA            const('02000');

// <Procedure: initialize>
// Sets SQL runtime options and prepares shared setup for SQL program execution.
// </Procedure: initialize>
dcl-proc initialize;
  dcl-pi *n;
  end-pi;

  exec sql
    set option
      commit = *none,
      datfmt = *iso,
      closqlcsr = *endmod;

  return;
  on-exit;
end-proc;

// <Procedure: mainSql>
// Runs input-driven SQL lookup flow and handles success, no-data, and error paths.
// </Procedure: mainSql>
dcl-proc mainSql;
  dcl-pi *n                       extpgm('TPLSQL01');
    p_inId                        packed(9:0) const options(*nopass : *omit);
  end-pi;

  dcl-s outName                   varchar(128) inz('');
  dcl-s rowCount                  int(10) inz(0);
  dcl-s hasError                  ind inz(*off);
  dcl-s DspMsg                    varchar(1024) inz(*Blank);
  dcl-s status                    packed(5);

  Monitor;
    initialize();

    If (%passed(p_inId));
      exec sql
        select
          NAME
        into
          :outName
        from MYTABLE
        where ID = :p_inId;

      If (sqlstate = SQLSTATE_OK);
        rowCount = 1;
      ElseIf (sqlstate = SQLSTATE_NO_DATA);
        rowCount = 0;
      Else;
        hasError = *on;
      EndIf;
    ElseIf (%omitted(p_inId));
      rowCount = 0;
    Else;
      rowCount = 0;
    EndIf;
  On-Error;
    status = %status();
    DspMsg = 'Unhandled Error in program: ' + %char(status);
    snd-msg *escape %trim(DspMsg);
  EndMon;

  If (hasError);
    // TODO: map SQL/runtime failure to caller-visible error contract.
  EndIf;

  *inlr = *on;
  return;
  on-exit;
end-proc;
