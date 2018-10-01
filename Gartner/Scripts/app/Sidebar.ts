module Gartner {

	export class Sidebar {

		onReady() {
			$('#menu-toggle').click((e: JQueryEventObject) => {
				e.preventDefault();
				$('#wrapper').toggleClass('toggled');
            });

            $('#RefreshData').tooltip();

            $('#RefreshData').click((e: JQueryEventObject) => {
                e.preventDefault();
                
                $.ajax({
                    url: '/api/Cache',
                    type: 'DELETE',
                    error: () => ErrorUtilities.showGeneralError(),
                    success: () => toastr.success('Refreshed Data.')
                }).done(() => $('#RefreshData').parent().blur());
            });
		}
	}
} 