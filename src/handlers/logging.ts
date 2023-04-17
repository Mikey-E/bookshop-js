//File to create a simple logging function to be used elsewhere as desired.

import {writeFileSync} from 'fs';

export function log(msg: string) {
	writeFileSync("logs.txt", new Date().toISOString() + ", " + msg + "\n", {flag: "a+"});//a+ is append mode
}
