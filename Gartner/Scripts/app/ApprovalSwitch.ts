/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/bootstrap-switch/bootstrapswitch.d.ts" />

interface ApprovalSwitchParams {
    switchId: string;
}

module Gartner {
    export class ApprovalSwitch {
        onReady(options: ApprovalSwitchParams) {
            var _switch = $("#" + options.switchId);
            _switch.bootstrapSwitch(); 
            _switch.on("switchChange.bootstrapSwitch",(event, state) => {
                _switch.bootstrapSwitch("toggleDisabled");
                _switch.closest("form").submit();
            });
        }
    }
} 