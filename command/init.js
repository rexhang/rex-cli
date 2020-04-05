/*
* @author RexHang
* @date 2020年4月4日, 0004
* @description 初始化项目
*/

'use strict';

const exec = require('child_process').exec;

const co = require('co');

const prompt = require('co-prompt');

const config = require('../templates');

const chalk = require('chalk');

const rimraf = require('rimraf');

module.exports = () => {
	co(function* () {
		console.log(chalk.blue(`-> 最新的模板列表如下:`));
		console.table({...{'template_name': { url: '↓', branch: '↓', author: '↓', remark: '↓' }}, ...config.tpl});
		// 处理用户输入
		let tplName = yield prompt('请输入需要使用的项目模板名称(*): ');
		if (!config.tpl[tplName]) {
			console.log(chalk.red(`没有叫做<${tplName}>的模板!`));
			process.exit();
		}
		let projectName = yield prompt('请输入本地初始化项目的目录名称(默认为《create-react-project》): ');
		if (!projectName) {
			projectName = 'create-react-project';
		}
		let gitUrl, branch;
		gitUrl = config.tpl[tplName].url;
		branch = config.tpl[tplName].branch;
		// git命令，远程拉取项目并自定义项目名
		let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`;
		console.log(chalk.white('\n 开始创建项目...'));
		exec(cmdStr, (error, stdout, stderr) => {
			if (error) {
				console.log(error);
				process.exit();
			}
			// 删除.git文件
			rimraf(`./${projectName}/.git/`, function (err) { // 删除当前目录下的 test.txt
				if (err){
					console.log(err);
					process.exit();
				}
				console.log(chalk.green('\n √ 项目创建完成!'));
				console.log(`\n cd ${projectName} && yarn install && yarn start \n`);
				process.exit();
			});
		});
	});
};