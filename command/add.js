/*
* @author RexHang
* @date 2020年4月4日, 0004
* @description 添加一个模板
*/

'use strict';

const co = require('co');

const prompt = require('co-prompt');

const config = require('../templates');

const chalk = require('chalk');

const fs = require('fs');

function exit(msg){
	console.log(chalk.red(msg));
	process.exit();
}

module.exports = () => {
	co(function *() {
		// 分步接收用户输入的参数
		let tplName = yield prompt('请输入项目模板名称(*): ');
		if (!tplName){
			exit('* 请输入项目模板名称');
		}
		let gitUrl = yield prompt('请输入项目模板远程地址(* eg: https://***.git): ');
		if (!gitUrl){
			exit('* 请输入项目模板远程地址(eg: https://***.git)');
		}
		let branch = yield prompt('请输入项目模板远程分支名称(默认为《master》): ');
		let author = yield prompt('请输入项目模板的作者名称: ');
		let remark = yield prompt('请输入项目模板的备注信息: ');
		// 避免重复添加
		if (!config.tpl[tplName]) {
			config.tpl[tplName] = {};
			// 过滤unicode字符
			config.tpl[tplName]['url'] = gitUrl.replace(/[\u0000-\u0019]/g, '');
			config.tpl[tplName]['branch'] = branch?branch:'master';
			config.tpl[tplName]['author'] = author?author:'no author';
			config.tpl[tplName]['remark'] = remark?remark:'no remark';
		} else {
			console.log(chalk.red('输入的项目模板名称已经存在!'));
			process.exit();
		}
		// 把模板信息写入templates.json
		fs.writeFile(__dirname + '/../templates.json', JSON.stringify(config,null,"\t"), 'utf-8', (err) => {
			if (err) console.log(err);
			console.log(chalk.green(`模板<${tplName}>添加成功!\n`));
			console.log(chalk.blue(`-> 最新的模板列表如下:`));
			console.table({...{'template_name': { url: '↓', branch: '↓', author: '↓', remark: '↓' }}, ...config.tpl});
			process.exit();
		});
	});
};