**free
ctl-opt nomain
        option(*srcstmt: *nodebugio)
        datfmt(*iso)
        timfmt(*iso)
        dftactgrp(*no)
        actgrp(*caller);

dcl-s DspMsg            varchar(1024) inz(*Blank) ;
dcl-s status            packed(5) ;

dcl-proc normalize_name export;
  dcl-pi *n varchar(256);
    inValue varchar(256) const;
  end-pi;

  dcl-s normalized varchar(256) inz('');

  monitor;
    normalized = service_proc_internal(inValue);
  on-error;
    status =  %status() ;
    DspMsg = 'Unhandled Error in program: ' + %char(status) ;
    snd-msg *escape %trim(DspMsg) ;
  endmon;

  return normalized;
end-proc;

dcl-proc service_proc_internal;
  dcl-pi *n varchar(256);
    inValue varchar(256) const;
  end-pi;

  return %trim(inValue);
end-proc;
