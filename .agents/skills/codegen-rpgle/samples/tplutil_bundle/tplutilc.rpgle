**free
// <Metadata>
// Source Name .........: TPLUTIL
// Created By ...........: R. Strauss
// Date Created .........: 2026-08-28
// Source Description ..: Service consumer scaffold for RPGLE callers.
// Jira ..................: N/A
// </Metadata>
//
// <Synopsis>
// Calls a service-program export with optional input and runtime error handling.
// </Synopsis>
//
// <Revision History>
// Revisioner | Date | Jira No (if known) | Change |
// R. Strauss | 2026-08-28 | N/A | Initial scaffold |
// </Revision History>

ctl-opt main(mainProc)
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*caller);

/INCLUDE 'qrpglesrc/service_api_include_member.rpgleinc'

// <Procedure: mainProc>
// Calls the service API with optional input and handles runtime error reporting.
// </Procedure: mainProc>
dcl-proc mainProc;
  dcl-pi *n                       extpgm('TPLUTIL');
    p_inValue                     varchar(256) const options(*nopass : *omit);
  end-pi;

  dcl-s outValue                  varchar(256) inz('');
  dcl-s DspMsg                    varchar(1024) inz(*Blank);
  dcl-s status                    packed(5);

  Monitor;
    If (%passed(p_inValue));
      outValue = normalizeName(p_inValue);
    ElseIf (%omitted(p_inValue));
      outValue = normalizeName('');
    Else;
      outValue = normalizeName('');
    EndIf;
  On-Error;
    status = %status();
    DspMsg = 'Unhandled Error in program: ' + %char(status);
    snd-msg *escape %trim(DspMsg);
  EndMon;

  *inlr = *on;
  return;
  on-exit;
end-proc;
