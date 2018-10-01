interface AutomagicScrollingParams {
    containerToAnimateSelector: string;
    scrollToId: string;
}

module Gartner {
    export class AutomagicScrolling {
        onReady(options: AutomagicScrollingParams) {
            var container = $(options.containerToAnimateSelector);
            var scrollTo = $("#" + options.scrollToId);

            if (container.offset() && scrollTo.offset()) {
                var scrollOffset = scrollTo.offset().top - container.offset().top;
                container.animate({ scrollTop: scrollOffset }, 300);
            }
        }
    }
} 