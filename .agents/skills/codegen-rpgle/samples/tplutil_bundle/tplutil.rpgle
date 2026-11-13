**free
// <Metadata>
// Source Name .........: TPLUTIL
// Created By ...........: R. Strauss
// Date Created .........: 2026-08-28
// Source Description ..: Service-program module scaffold for reusable RPG logic.
// Jira ..................: N/A
// </Metadata>
//
// <Synopsis>
// Exported service procedure plus internal helper in a nomain module.
// </Synopsis>
//
// <Revision History>
// Revisioner | Date | Jira No (if known) | Change |
// R. Strauss | 2026-08-28 | N/A | Initial scaffold |
// </Revision History>

ctl-opt nomain
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*caller);

dcl-s DspMsg                      varchar(1024) inz(*Blank);
dcl-s status                      packed(5);

// <Procedure: normalizeName>
// Validates and delegates public service work, returning normalized output.
// </Procedure: normalizeName>
dcl-proc normalizeName export;
  dcl-pi *n                       varchar(256);
    p_inValue                     varchar(256) const;
  end-pi;

  dcl-s normalized                varchar(256) inz('');

  Monitor;
    normalized = serviceProcInternal(p_inValue);
  On-Error;
    status = %status();
    DspMsg = 'Unhandled Error in program: ' + %char(status);
    snd-msg *escape %trim(DspMsg);
  EndMon;

  return normalized;
  on-exit;
end-proc;

// <Procedure: serviceProcInternal>
// Applies internal normalization logic used by the exported service procedure.
// </Procedure: serviceProcInternal>
dcl-proc serviceProcInternal;
  dcl-pi *n                       varchar(256);
    p_inValue                     varchar(256) const;
  end-pi;

  return %trim(p_inValue);
  on-exit;
end-proc;
