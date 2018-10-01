module Gartner {
	export class RelationshipTree {
		onReady() {
			$(function () {
				$('.tree li:has(ul)').addClass('parent_li').find(' > span > h3 > i').attr('title', 'Collapse this branch');
				$('.tree li.parent_li > span > h3 > i').on('click', function (e) {
					var children = $(this).closest('li.parent_li').find(' > ul > li');
					if (children.is(":visible")) {
						children.hide('fast');
						$(this).removeClass('icon-minus-sign').addClass('icon-plus-sign').attr('title', 'Expand this branch');											
					} else {
						children.show('fast');
						$(this).removeClass('icon-plus-sign').addClass('icon-minus-sign').attr('title', 'Collapse this branch');
					}
					e.stopPropagation();
				});
			});

			$(function () {
				$('.hideshow').on('click', function (e) {
					var $this = $(this);

					$($this.closest('span').find('.show-details')).slideToggle('slow');
					if ($this.text() == 'Hide Details') {
						$this.text('Show Details');
					}
					else {
						$this.text('Hide Details');
					}
					e.stopPropagation();
				});
			});

			$('#all').click(function () {
				$('.tree li:has(ul)').each(function () {
					$(this).toggleClass('active');
					$(this).children('ul').slideToggle('fast');
				});
			});
		}
			
	}
} 