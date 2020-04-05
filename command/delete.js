/*
* @author RexHang
* @date 2020年4月4日, 0004
* @description 删除一个模板
*/

'use strict';

const co = require('co');

const prompt = require('co-prompt');

const config = require('../templates');

const chalk = require('chalk');

const fs = require('fs');

module.exports = () => {
	co(function *() {
		// 先输出现有的模板列表
		console.log(chalk.blue(`-> 最新的模板列表如下:`));
		console.table({...{'template_name': { url: '↓', branch: '↓', author: '↓', remark: '↓' }}, ...config.tpl});
		// 接收用户输入的参数
		let tplName = yield prompt('请输入要删除的模板名称(*): ');
		// 删除对应的模板
		if (config.tpl[tplName]) {
			delete config.tpl[tplName];
		} else {
			console.log(chalk.red(`没有叫做<${tplName}>的模板!`));
			process.exit();
		}
		// 写入template.json
		fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config, null, '\t'), 'utf-8', (err) => {
			if (err) console.log(err);
			console.log(chalk.green(`-> 模板<${tplName}>删除成功!`));
			console.log(chalk.blue(`-> 最新的模板列表如下:`));
			console.table({...{'template_name': { url: '↓', branch: '↓', author: '↓', remark: '↓' }}, ...config.tpl});
			process.exit();
		});
		
	});
};