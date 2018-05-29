var os = require('os');

var self = exports;

exports.run = function (istream, ostream, main) {
	function write (chunk) {
		ostream.cork();
		ostream.write(chunk);
		ostream.uncork();
	}

	var main_itr = main(write);
	var chunks = [];
	var ended = false;

	function get_chunk (chunk) {
		istream.pause();
		chunks.push(chunk);
		loop();
	}

	function loop () {
		var result = main_itr.next(chunks.shift());
		if (undefined !== result.value) {
			write(result.value);
		}

		if (result.done) return;

		ended ? get_chunk(null) : process.stdin.resume();
	}
	process.stdin.on('data', get_chunk);
	process.stdin.on('end', function () {
		ended = true;
		get_chunk(null);
	});

	get_chunk(null);
};

exports.stdrun = function (main) {
	process.stdin.setEncoding('utf8');

	self.run(process.stdin, process.stdout, function * (write) {
		function writeln (chunk, end) {
			write(chunk + (undefined === end ? os.EOL : end));
		}

		var main_itr = main (writeln);
		var words = [null];

		var result;
		var next_line;
		while (!(result = main_itr.next(words.shift())).done) {
			if (undefined !== result.value) {
				if (result.value instanceof Buffer) {
					write(result.value);
				} else if ('string' === typeof result.value) {
					write(result.value);
				} else {
					write(`${result.value}`);
				}
			}

			while (0 === words.length) {
				var chunk = yield;
				if (null === chunk) {
					words.push(null);
				} else {
					words.push(...chunk.split(/\s+/).filter(s => s));
				}
			}
		}
	});
};
