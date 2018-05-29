# node-yieldin
An easy interactive way to use Readable/Writable streams (I/O streams) with `yield` in a generator function. 

## Install
```
npm install github:accup/node-yieldin
```
or
```
npm install accup/node-yieldin
```
will be available.

## Examples
### Use it as interactive I/O
The keyword `yield` works as a keyword of interactive I/O.

* `main` generator can obtain a parameter which is a function to write chunk to stream.
* `yield` returns `null` when the `istream` has ended.
```Javascript
var yieldin = require('yieldin');

/**
 * any I/O streams
 */
var readable, writable;

/**
 * The first argument should be readable stream.
 * The second argument should be writable stream.
 * The third argument should be generator function (function *).
 */
yieldin.run(readable, writable, function * (write) {
	// Write "xxx" to writable stream.
	write("xxx");
	// Read a chunk from readable stream.
	var chunk = yield;

	// --------------------------------------
	// Next statement is the same as previous statements.
	var chunk = yield "xxx";
});
```

### Use it as interactive standard I/O (stdin/stdout)
`yieldin.stdrun(main)` is similar with `yieldin.run(stdin, stdout, main)`, but, in the `yieldin.stdrun`,
* always call `stdin.setEncoding('utf8')`.
* `yield` returns a __word__ (for example, when getting chunk "a b c", `yield` first returns "a" and secondly returns "b", ...).
* `write` function has __2__ parameters. The __second__ parameter is __line-terminator (like '\r\n')__ (default is `os.EOL`).
```Javascript
var yieldin = require('yieldin');

yieldin.stdrun(function * (write) {
	// Question and Answer
	// For no line-terminator writing, assigning "" to the second param.
	write("What's your favorite food? ", "");
	var food = yield;
	write(`Oh, '${food}', that's nice!`);

	// Shorthand of Q&A
	// In contrast, `yield` writing has no line-terminator.
	var food = yield "What's your favorite food? ";
	write(`Oh, '${food}', that's nice!`);

	// Very-shorthand of Q&A
	write(`Oh, '${yield "What's your favorite food? "}', that's nice!`);
});
// [result (maybe)]
// What's your favorite food? sushi
// Oh, 'sushi', that's nice!
// What's your favorite food? 寿司
// Oh, '寿司', that's nice!
// What's your favorite food? 🍣
// Oh, '🍣', that's nice!
```

## Logs
* Restore this repository *2018/05/29*
* Ver1.0.2
	* Update `yield` operation. `yield` returns `null` when a `istream` (readable stream) has ended.
	* Fix a small bug. The older version of `stdrun(main)` refered `run(istream, ostream, main)` as `this.run`, then if `run` was assigned to another variable, `this` didn't refers `yieldin` and `run` threw an error.

## Old logs
* Ver1.0.1
	* The second parameter of `write(chunk, end)` in `stdrun` supported, then `run(stdin, stdout, main)` & `stdrun(main)` became different.
* Ver1.0.0
	* Both `run(stdin, stdout, main)` & `stdrun(main)` are the same operation. 

## Remarks
* This is a repository to consider making an npm package.