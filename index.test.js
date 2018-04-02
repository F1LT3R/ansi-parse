import chalk from 'chalk'
import test from 'ava'
import ansiParse from '.'

test('parses colors', t => {
	const text = chalk`Your {red wish} is\n {bgYellow my} command.`
	const parsed = ansiParse(text)
	const expected = [{type: 'text', value: 'Your ', position: {x: 0, y: 0, n: 0, raw: 0}, style: {}}, {type: 'ansi', value: {tag: 'red', ansi: '\\u001b[31m'}, position: {x: 5, y: 0, n: 5, raw: 5}}, {type: 'text', value: 'wish', position: {x: 5, y: 0, n: 5, raw: 10}, style: {foregroundColor: 'red'}}, {type: 'ansi', value: {tag: 'foregroundColorClose', ansi: '\\u001b[39m'}, position: {x: 9, y: 0, n: 9, raw: 14}}, {type: 'text', value: ' is', position: {x: 9, y: 0, n: 9, raw: 19}, style: {}}, {type: 'newline', value: '\n', position: {x: 12, y: 0, n: 12, raw: 22}}, {type: 'text', value: ' ', position: {x: 0, y: 1, n: 13, raw: 23}, style: {}}, {type: 'ansi', value: {tag: 'bgYellow', ansi: '\\u001b[43m'}, position: {x: 1, y: 1, n: 14, raw: 24}}, {type: 'text', value: 'my', position: {x: 1, y: 1, n: 14, raw: 29}, style: {backgroundColor: 'bgYellow'}}, {type: 'ansi', value: {tag: 'backgroundColorClose', ansi: '\\u001b[49m'}, position: {x: 3, y: 1, n: 16, raw: 31}}, {type: 'text', value: ' command.', position: {x: 3, y: 1, n: 16, raw: 36}, style: {}}]
	t.deepEqual(parsed, expected)
})

test('resets styles', t => {
	const text = chalk`{red RED}\n{bgGreen GREEN}`
	const parsed = ansiParse(text)
	const expected = [{type: 'ansi', value: {tag: 'red', ansi: '\\u001b[31m'}, position: {x: 0, y: 0, n: 0, raw: 0}}, {type: 'text', value: 'RED', position: {x: 0, y: 0, n: 0, raw: 5}, style: {foregroundColor: 'red'}}, {type: 'ansi', value: {tag: 'foregroundColorClose', ansi: '\\u001b[39m'}, position: {x: 3, y: 0, n: 3, raw: 8}}, {type: 'newline', value: '\n', position: {x: 3, y: 0, n: 3, raw: 13}}, {type: 'ansi', value: {tag: 'bgGreen', ansi: '\\u001b[42m'}, position: {x: 0, y: 1, n: 4, raw: 14}}, {type: 'text', value: 'GREEN', position: {x: 0, y: 1, n: 4, raw: 19}, style: {backgroundColor: 'bgGreen'}}, {type: 'ansi', value: {tag: 'backgroundColorClose', ansi: '\\u001b[49m'}, position: {x: 5, y: 1, n: 9, raw: 24}}]
    t.is(parsed, expected)
})

test('parses robot face as string', t => {
	const text = '🤖\\u001b[31m DANGER\\u001b[0m Will Robbinson'
	const parsed = ansiParse(text)
	const expected = [{type: 'text', value: '🤖', position: {x: 0, y: 0, n: 0, raw: 0}, style: {}}, {type: 'ansi', value: {tag: 'red', ansi: '\\u001b[31m'}, position: {x: 2, y: 0, n: 2, raw: 2}}, {type: 'text', value: ' DANGER', position: {x: 2, y: 0, n: 2, raw: 7}, style: {foregroundColor: 'red'}}, {type: 'ansi', value: {tag: 'reset', ansi: '\\u001b[0m'}, position: {x: 9, y: 0, n: 9, raw: 14}}, {type: 'text', value: ' Will Robbinson', position: {x: 9, y: 0, n: 9, raw: 18}, style: {}}]
	t.deepEqual(parsed, expected)
})
