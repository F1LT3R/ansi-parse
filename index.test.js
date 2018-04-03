import chalk from 'chalk'
import test from 'ava'
import ansiParse from '.'

test('gets opening red ansi escape char', t => {
	const text = chalk.red('_')
	const parsed = ansiParse(text)
	const firstAnsi = parsed[0].value.ansi
	t.is(firstAnsi, '\u001B[31m')
})

test('parses colors', t => {
	const text = chalk`Your {red wish} is\n {bgYellow my} command.`
	const parsed = ansiParse(text)
	const expected = [{
		type: 'text',
		value: 'Your ',
		position: {
			x: 0,
			y: 0,
			n: 0,
			raw: 0
		},
		style: {}
	}, {
		type: 'ansi',
		value: {
			tag: 'red',
			ansi: '\u001B[31m'
		},
		position: {
			x: 5,
			y: 0,
			n: 5,
			raw: 5
		}
	}, {
		type: 'text',
		value: 'wish',
		position: {
			x: 5,
			y: 0,
			n: 5,
			raw: 10
		},
		style: {
			foregroundColor: 'red'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 9,
			y: 0,
			n: 9,
			raw: 14
		}
	}, {
		type: 'text',
		value: ' is',
		position: {
			x: 9,
			y: 0,
			n: 9,
			raw: 19
		},
		style: {}
	}, {
		type: 'newline',
		value: '\n',
		position: {
			x: 12,
			y: 0,
			n: 12,
			raw: 22
		}
	}, {
		type: 'text',
		value: ' ',
		position: {
			x: 0,
			y: 1,
			n: 13,
			raw: 23
		},
		style: {}
	}, {
		type: 'ansi',
		value: {
			tag: 'bgYellow',
			ansi: '\u001B[43m'
		},
		position: {
			x: 1,
			y: 1,
			n: 14,
			raw: 24
		}
	}, {
		type: 'text',
		value: 'my',
		position: {
			x: 1,
			y: 1,
			n: 14,
			raw: 29
		},
		style: {
			backgroundColor: 'bgYellow'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'backgroundColorClose',
			ansi: '\u001B[49m'
		},
		position: {
			x: 3,
			y: 1,
			n: 16,
			raw: 31
		}
	}, {
		type: 'text',
		value: ' command.',
		position: {
			x: 3,
			y: 1,
			n: 16,
			raw: 36
		},
		style: {}
	}]
	t.deepEqual(parsed, expected)
})

test('resets styles', t => {
	const text = chalk`{red RED}\n{bgGreen GREEN}`
	const parsed = ansiParse(text)
	const expected = [{
		type: 'ansi',
		value: {
			tag: 'red',
			ansi: '\u001B[31m'
		},
		position: {
			x: 0,
			y: 0,
			n: 0,
			raw: 0
		}
	}, {
		type: 'text',
		value: 'RED',
		position: {
			x: 0,
			y: 0,
			n: 0,
			raw: 5
		},
		style: {
			foregroundColor: 'red'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 3,
			y: 0,
			n: 3,
			raw: 8
		}
	}, {
		type: 'newline',
		value: '\n',
		position: {
			x: 3,
			y: 0,
			n: 3,
			raw: 13
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'bgGreen',
			ansi: '\u001B[42m'
		},
		position: {
			x: 0,
			y: 1,
			n: 4,
			raw: 14
		}
	}, {
		type: 'text',
		value: 'GREEN',
		position: {
			x: 0,
			y: 1,
			n: 4,
			raw: 19
		},
		style: {
			backgroundColor: 'bgGreen'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'backgroundColorClose',
			ansi: '\u001B[49m'
		},
		position: {
			x: 5,
			y: 1,
			n: 9,
			raw: 24
		}
	}]
	t.deepEqual(parsed, expected)
})

test('parses robot face as string', t => {
	const text = '🤖\u001B[31m DANGER\u001B[0m Will Robbinson'
	const parsed = ansiParse(text)
	const expected = [{
		type: 'text',
		value: '🤖',
		position: {
			x: 0,
			y: 0,
			n: 0,
			raw: 0
		},
		style: {}
	}, {
		type: 'ansi',
		value: {
			tag: 'red',
			ansi: '\u001B[31m'
		},
		position: {
			x: 2,
			y: 0,
			n: 2,
			raw: 2
		}
	}, {
		type: 'text',
		value: ' DANGER',
		position: {
			x: 2,
			y: 0,
			n: 2,
			raw: 7
		},
		style: {
			foregroundColor: 'red'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'reset',
			ansi: '\u001B[0m'
		},
		position: {
			x: 9,
			y: 0,
			n: 9,
			raw: 14
		}
	}, {
		type: 'text',
		value: ' Will Robbinson',
		position: {
			x: 9,
			y: 0,
			n: 9,
			raw: 18
		},
		style: {}
	}]
	t.deepEqual(parsed, expected)
})

test('reset bold', t => {
	const text = `\u001B[1m BOLD\u001B[0m NORMAL`
	const parsed = ansiParse(text)
	t.deepEqual(parsed[3].style, {})
})

test('open/close the rainbow', t => {
	const text = chalk.red('red ') +
		chalk.yellow('yellow ') +
		chalk.green('green ') +
		chalk.cyan('cyan ') +
		chalk.blue('blue ') +
		chalk.magenta('magenta')

	const parsed = ansiParse(text)
	const expected = [{
		type: 'ansi',
		value: {
			tag: 'red',
			ansi: '\u001B[31m'
		},
		position: {
			x: 0,
			y: 0,
			n: 0,
			raw: 0
		}
	}, {
		type: 'text',
		value: 'red ',
		position: {
			x: 0,
			y: 0,
			n: 0,
			raw: 5
		},
		style: {
			foregroundColor: 'red'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 4,
			y: 0,
			n: 4,
			raw: 9
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'yellow',
			ansi: '\u001B[33m'
		},
		position: {
			x: 4,
			y: 0,
			n: 4,
			raw: 14
		}
	}, {
		type: 'text',
		value: 'yellow ',
		position: {
			x: 4,
			y: 0,
			n: 4,
			raw: 19
		},
		style: {
			foregroundColor: 'yellow'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 11,
			y: 0,
			n: 11,
			raw: 26
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'green',
			ansi: '\u001B[32m'
		},
		position: {
			x: 11,
			y: 0,
			n: 11,
			raw: 31
		}
	}, {
		type: 'text',
		value: 'green ',
		position: {
			x: 11,
			y: 0,
			n: 11,
			raw: 36
		},
		style: {
			foregroundColor: 'green'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 17,
			y: 0,
			n: 17,
			raw: 42
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'cyan',
			ansi: '\u001B[36m'
		},
		position: {
			x: 17,
			y: 0,
			n: 17,
			raw: 47
		}
	}, {
		type: 'text',
		value: 'cyan ',
		position: {
			x: 17,
			y: 0,
			n: 17,
			raw: 52
		},
		style: {
			foregroundColor: 'cyan'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 22,
			y: 0,
			n: 22,
			raw: 57
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'blue',
			ansi: '\u001B[34m'
		},
		position: {
			x: 22,
			y: 0,
			n: 22,
			raw: 62
		}
	}, {
		type: 'text',
		value: 'blue ',
		position: {
			x: 22,
			y: 0,
			n: 22,
			raw: 67
		},
		style: {
			foregroundColor: 'blue'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 27,
			y: 0,
			n: 27,
			raw: 72
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'magenta',
			ansi: '\u001B[35m'
		},
		position: {
			x: 27,
			y: 0,
			n: 27,
			raw: 77
		}
	}, {
		type: 'text',
		value: 'magenta',
		position: {
			x: 27,
			y: 0,
			n: 27,
			raw: 82
		},
		style: {
			foregroundColor: 'magenta'
		}
	}, {
		type: 'ansi',
		value: {
			tag: 'foregroundColorClose',
			ansi: '\u001B[39m'
		},
		position: {
			x: 34,
			y: 0,
			n: 34,
			raw: 89
		}
	}]

	t.deepEqual(parsed, expected)
})
