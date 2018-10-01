/// <reference path="../typings/alertify/alertify.d.ts" />

module Gartner {

	export class createRemoveAlert {

		private eventId: number;

		onReady(json: { eventId?: number; }) {
			$("body")
				.off("click", "#removeIdeasFromEvent")
				.on("click", "#removeIdeasFromEvent", (event: JQueryEventObject) => {
					event.preventDefault();
					this.confirm();
					this.eventId = json.eventId;
				});            
		}

		confirm() {
			var toastrOptions: ToastrOptions = {
				closeButton: false,
				debug: false,
				newestOnTop: true,
				progressBar: false,
				positionClass: "toast-top-right",
				preventDuplicates: false,
				onclick: null,
				showDuration: 300,
				hideDuration: 300,
				timeOut: 0,
				extendedTimeOut: 0,
				showEasing: "swing",
				hideEasing: "linear",
				showMethod: "fadeIn",
				hideMethod: "fadeOut"
			};
			var confirmMessage = "Are you sure you want to remove all unsubmitted Ideas that are tagged to this event? This action cannot be undone."

			alertify.confirm(confirmMessage, (yes) => {
				if (yes) {  
					toastr.clear();                 

					$.ajax({
						type: "POST",						
						url: '/EventDashboard/RemoveIdeasForEvent/' + this.eventId,
						success: (response) => {
							location.reload(true);
						},  
						error: () => {
							toastr.info("Error");
						}                     
					});		
				}
			}, "removeIdeasFromEventDialog");

			
		}
	}
} 		