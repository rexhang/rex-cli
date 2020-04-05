/*
* @author RexHang
* @date 2020年4月4日, 0004
* @description 显示模板列表
*/

'use strict';

const chalk = require('chalk');

const config = require('../templates');

module.exports = () => {
	console.log(chalk.blue(`-> 最新的模板列表如下:`));
	console.table({...{'template_name': { url: '↓', branch: '↓', author: '↓', remark: '↓' }}, ...config.tpl});
	process.exit();
};