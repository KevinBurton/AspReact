/// <reference path="../typings/jquery/jquery.d.ts" />

module Gartner {

	export function handleGridSaveError(event) {

		if (event.errors) {
			ErrorUtilities.showErrorMessage("Grid Saving", event.errors.grid_error.errors[0]);
		}
		else
		{
			ErrorUtilities.showGeneralError();
		}
	}
} 