// Type definitions for yieldin 1.0.2
// Project: https://github.com/accup/node-yieldin
// Definitions by: accup <https://github.com/accup>

/**
 * Run a generator `main` using the interactive I/O streams as `yield`.
 * 
 * `yield` returns `null` when the `istream` has ended.
 * @param istream 
 * @param ostream 
 * @param main 
 */
export function run (
	istream: stream.Readable,
	ostream: stream.Writable,
	main: (write: (chunk: string|Buffer) => void) => IterableIterator<string|Buffer|null>
): void;

/**
 * Run a generator `main` using the interactive standard I/O as `yield`.
 * 
 * `yield` returns `null` when the `istream` has ended.
 * 
 * This function always calls `process.stdin.setEncoding('utf8')`.
 */
export function stdrun (
	main: (write: (chunk: string, end?: string) => void) => IterableIterator<string|null>,
): void;

import stream = require("stream");
