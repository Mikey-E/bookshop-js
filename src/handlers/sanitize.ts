//To prevent HTML/SQL injection
export const sanitizeString = (str: string): string => {

	let result = str;

	interface Dictionary {
		[key: string]: string;
	}

	const mapping: Dictionary = {
		";"	:	"&semi",
		"\"":	"&quot",
		"'"	:	"&apos",
		"<"	:	"&lt",
		">"	:	"&gt",
		"\r":	"&br",
		"\b":	"&back",
		"\n":	"&new",
		"\t":	"&tab",
		"\\":	"&bk",
		"\%":	"&per",
		"_"	:	"&un"
	}

	for (const key in mapping) {
		result = result.replace(key, mapping[key]);
	}

	for (const key in mapping) {
		if (result.includes(key)) {
			return sanitizeString(result);
		}
	}

	return result;
}

export const validateInt = (numString: string): boolean => {
	const numberRegex = /^[0-9]*$/;
	return numberRegex.test(numString);
}

export const validateFloat = (numString: string): boolean => {
	try{
		let arr = numString.split(".");
		if (arr.length >= 3) {
			return false;
		}
		return (validateInt(arr[0]) && validateInt(arr[1]) && (arr[1].length == 2));
	}catch (error){
		return false;
	}
}
