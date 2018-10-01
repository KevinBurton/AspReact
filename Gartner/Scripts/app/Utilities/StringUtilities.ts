module Gartner.StringUtilities {
	function reverse(str: string) {
		return str.split("").reverse().join("");
	}

	function clone(str: string) {
		return str.split("").join("");
	}

	function trimFront(str: string, stringToReplace: string) {
		var toBeTrimmed = clone(str);
		while (toBeTrimmed.indexOf(stringToReplace) === 0) {
			toBeTrimmed = toBeTrimmed.replace(stringToReplace, "");
		}

		return toBeTrimmed;
	}

	function trimEnd(str: string, stringToReplace: string) {
		// trim end by reversing and string replacing
		var reversed = reverse(str);
		var trimmed = trimFront(reversed, stringToReplace);

		return reverse(trimmed);
	}

	export function trimBlankLines(value: string): string {
		var replaceFront = "<p>&nbsp;</p>\n\n";
		var replaceEnd = "\n\n" + reverse("<p>&nbsp;</p>");

		// fix end of line to have two \n's for better string replacement
		if (value.length > 1 && value[value.length - 1] === "\n" && value[value.length - 2] !== "\n") {
			value = value + "\n";
		}

		return trimEnd(trimFront(value, replaceFront), replaceEnd);
	}

	function json(str: string) {
		return JSON.stringify(str);
	}
} 