**free
// Sample: valid named indicator usage for validator proof.

ctl-opt option(*srcstmt: *nodebugio)
        dftactgrp(*no)
        actgrp(*new);

dcl-s exitFlag                    ind inz(*off);

exitFlag = *on;
*inlr = *on;
return;
