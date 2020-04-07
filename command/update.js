/**
* @author: rexhanggu
* @email: rexhanggu@tencent.com
* @date: 2020/4/7 10:49
* @description：更新模板库
*/

/*source文件夹请勿手动新建*/

const exec = require('child_process').exec;

const progressBar = require('../common/progress-bar.js');

const chalk = require('chalk');

const path = require('path');

const fs = require("fs") ;

const rootDirectory = path.join(__dirname, '../');

const sourceDirectory = rootDirectory + 'source/';

global.l = console.log;

// 初始化一个进度条长度为 50 的 ProgressBar 实例
const pb = new progressBar('进度', 50);

module.exports = () => {
	l(chalk.white('\n 开始更新模板库...'));
	fs.exists(sourceDirectory, (exists)=>{
		// git命令，远程拉取更新
		let cmdStr = '';
		if(!exists){
			// 文件夹不存在
			cmdStr = `git clone https://github.com/rexhang/rex-cli.git source`;

		} else {
			// 强制拉取远程代码
			cmdStr = `cd ${sourceDirectory} && git fetch --all && git reset --hard origin/master && git pull`;
		}
		const workerProcess = exec(cmdStr, (error, stdout, stderr) => {
			if (error) {
				l(chalk.red(error));
				process.exit();
			}
			// 合并文件
			// 进入source把模板信息写入templates.json
			const sourceTemp = require(`${sourceDirectory}/templates.json`);
			fs.writeFile(rootDirectory + 'templates.json', JSON.stringify(sourceTemp, null,"\t"), 'utf-8', (err) => {
				if (err) l(err);
				l(chalk.green('\n √ 模板库更新完成!'));
				l(chalk.blue(`-> 最新的模板列表如下:`));
				console.table({...{'template_name': { url: '↓', branch: '↓', author: '↓', remark: '↓' }}, ...require(rootDirectory + 'templates.json').tpl});
				process.exit();
			});
		});
		let num = 0, total = 100;
		workerProcess.stdout.on('data', (data) => {
			console.log(chalk.blue(` => stdout: ${data}`));
			pb.render({ completed: num, total });
			num = num + 50;
		});
		// workerProcess.stderr.on('data', (data) => {
		// 	console.log(`stderr: ${data}`);
		// 	pb.render({ completed: 50, total: 100 });
		// });
		// workerProcess.on('close', (code) => {
		// 	console.log(`child process exited with code ${code}`);
		// 	pb.render({ completed: 100, total: 100 });
		// });

	});

};