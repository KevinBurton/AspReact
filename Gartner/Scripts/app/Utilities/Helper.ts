module Gartner {
	var seed = 1;
	export var uid = (() => {
		
		return {
			new(p) {
				return p + (seed++);
			}
		}
	}) ();

	export var uniqueId =(param) => {
		return param + (seed++);
	} 
} 