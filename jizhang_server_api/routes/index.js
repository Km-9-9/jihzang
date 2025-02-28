var express = require('express');
var router = express.Router();
var db = require("../util/dbconfig"); // 引入数据库方法

var bodyparser = require('body-parser');
// 已解析表单提交数据为例 application/x-www-form-urlencoded
// extended: false 值是false时解析值是“String”或“Array” 值是true的时候可以解析任意类型的数据

//注册 
router.get('/register', (req, res) => {
	console.log(req.query);
	let sql1 = `select * from users where tel = '${req.query.tel}'` // 查找数据表中是否已经存在用户
	let sql2 = `INSERT INTO users(tel,paw) VALUES(?,?)` // 插入语句，将前端传递过来的手机号和密码插入到数据库中
	db.query(sql1, function (err, data) {
		if (err) {
			res.send({
				msg: "注册失败",
				code: 500
			});
		} else {
			if (data.length ==
				0) { // data 为查询出来的结果，如果查询的手机号不存在，将会返回一个空数据 所有此时 data[0]==undefined, 执行插入语句操作;
				db.query(sql2, [req.query.tel, req.query.paw], function (err, data) {
					if (err) {
						res.send({
							code: 500,
							msg: "注册失败!",
						});
						console.log(err)
					} else {
						// console.log(data);
						// res.redirect("/users"); 重定向，添加完后返回到用户首页
						res.send({
							msg: "注册成功",
							code: 200
						});
					}
				});
			} else {
				// 当tel用户存在时
				res.send({
					code: 0,
					msg: '用户名已存在'
				})
			}
		}
	});
});


// 登录
router.get('/signIn', (req, res) => {
	let { tel, paw } = req.query;
	let sql = `SELECT * FROM users WHERE tel = ?`; // 使用参数化查询防止 SQL 注入
	db.query(sql, [tel], (err, data) => {
		if (err) {
			console.log(err);
			return res.json({
				code: -1,
				msg: '登录失败'
			});
		} else {
			// 当 data 数组不为空时，代表该手机号注册过，然后匹对密码
			if (data.length == 0) {
				// 当 data 为空数组时，代表该手机号没有注册
				res.send({
					data: data,
					code: 0,
					msg: "该用户没有注册"
				});
			} else {
				if (data[0].paw == paw) {
					// 登录成功后，删除 auto_backup 表中 7 天前的数据
					let deleteSql = `DELETE FROM auto_backup WHERE backup_time < NOW() - INTERVAL 7 DAY`;
					db.query(deleteSql, (deleteErr, deleteResult) => {
						if (deleteErr) {
							console.log(deleteErr);
							return res.json({
								code: -1,
								msg: '删除备份数据失败'
							});
						} else {
							console.log("删除了 7 天前的备份数据");
							res.send({
								data: data[0],
								code: 200,
								token: "jk1235468956dasldsa",
								msg: "登录成功！"
							});
						}
					});
				} else {
					res.send({
						code: 500,
						msg: "密码错误"
					});
				}
			}
		}
	});
});
// 获取本人某月记账记录
router.get('/getInfo', (req, res) => {
	const { tel, yearNow, monthNow } = req.query;
	// 使用 DATE_FORMAT 函数格式化日期
	const sql1 = `SELECT *, DATE_FORMAT(time, '%Y-%m-%d') as formatted_time FROM info WHERE tel = ? AND time REGEXP ?`;
	const regexPattern = `${yearNow}-${monthNow}`;
	db.query(sql1, [tel, regexPattern], function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			// 将格式化后的日期替换原日期字段
			data.forEach(item => {
				item.time = item.formatted_time;
				delete item.formatted_time;
			});
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});

// 根据类型本人某月记账记录
router.get('/getLeixing', (req, res) => {
	const { tel, yearNow, monthNow, type } = req.query;
	// 使用 DATE_FORMAT 函数格式化日期
	const sql1 = `SELECT *, DATE_FORMAT(time, '%Y-%m-%d') as formatted_time FROM info WHERE tel = ? AND time REGEXP ? AND type = ?`;
	const regexPattern = `${yearNow}-${monthNow}`;
	db.query(sql1, [tel, regexPattern, type], function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			// 将格式化后的日期替换原日期字段
			data.forEach(item => {
				item.time = item.formatted_time;
				delete item.formatted_time;
			});
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});

// 记一笔
router.get('/addInfo', (req, res) => {
	console.log(req.query);
	let sql =
		`INSERT INTO info(tel,isActive,money,msg,time,day,type,num) VALUES(?,?,?,?,?,?,?,?)`
	db.query(sql, [req.query.tel, req.query.isActive, req.query.money, req.query.msg, req.query.time, req.query.day, req
		.query.type, req.query.num], function (err, data) {
			if (err) {
				res.send({
					code: 500,
					msg: "添加失败!",
				});
				console.log(err)
			} else {
				res.send({
					msg: "添加成功!",
					code: 200
				});
			}
		});

});

// 筛选本人支出or收入记账记录
router.get('/getisActive', (req, res) => {
	console.log(req.query);
	let sql1 = `select * from info where tel = '${req.query.tel}' and time REGEXP '${req.query.yearNow}-${req.query.monthNow}' and isActive = '${req.query.isActive}'`
	db.query(sql1, function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});

// 根据记账id获取记账详情
router.get('/getDetail', (req, res) => {
	console.log(req.query);
	let sql1 = `select * from info where id = ${req.query.id}`
	db.query(sql1, function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});
// 获取本人本月预算
router.get('/getYusuan', (req, res) => {
	console.log(req.query);
	let sql1 = `select * from yusuan where tel = ${req.query.tel} and year = ${req.query.year} and month = ${req.query.month}`
	db.query(sql1, function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});

// 设置本月预算
router.get('/setBudget', (req, res) => {
	// console.log(req.query);
	let sql =
		`INSERT INTO yusuan(tel,budget,year,month) VALUES(?,?,?,?)`
	db.query(sql, [req.query.tel, req.query.budget, req.query.year, req.query.month], function (err, data) {
		if (err) {
			res.send({
				code: 500,
				msg: "设置失败!",
			});
			console.log(err)
		} else {
			res.send({
				msg: "设置成功!",
				code: 200
			});
		}
	});
});

// 修改预算
router.get('/editBudget', (req, res) => {
	// console.log(req.query);
	let sql =
		`update yusuan set budget='${req.query.budget}' where tel=${req.query.tel} and year = ${req.query.year} and month = ${req.query.month}`
	db.query(sql, [req.query.budget, req.query.tel, req.query.year, req.query.month], function (err, data) {
		if (err) {
			res.send({
				code: 500,
				msg: "修改失败!",
			});
			console.log(err)
		} else {
			res.send({
				msg: "修改成功!",
				code: 200
			});
		}
	});
});
// 修改记账
router.get('/editInfo', (req, res) => {
	console.log(req.query);

	// 参数化查询（安全写法）
	const sql = `UPDATE info SET 
        isActive = ?, 
        money = ?, 
        msg = ?, 
        time = ?, 
        day = ?, 
        type = ?, 
        num = ? 
        WHERE id = ?`;

	const values = [
		req.query.isActive,
		req.query.money,
		req.query.msg,
		req.query.time,
		req.query.day,
		req.query.type,
		req.query.num,
		req.query.id
	];

	db.query(sql, values, function (err, data) {
		if (err) {
			console.error('SQL Error:', err);
			res.send({
				code: 500,
				msg: "修改失败!"
			});
		} else {
			res.send({
				msg: "修改成功!",
				code: 200
			});
		}
	});
});

// 根据记账id删除记账
router.get('/delInfo', (req, res) => {
	console.log(req.query);
	let sql1 = `delete from info where id = ${req.query.id}`
	db.query(sql1, function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});

// 查询年记账数据
router.get('/getJizhangYear', (req, res) => {
	console.log(req.query)
	// 查询用户语句
	let sql = `select * from info where tel = '${req.query.tel}' and time REGEXP '${req.query.yearNow}'`
	db.query(sql, (err, data) => {
		if (err) {
			console.log(err);
			return res.json({
				code: 500,
				msg: '搜索失败'
			})
		} else {
			console.log(data)
			res.send({
				list: data,
				code: 200,
				msg: "搜索成功"
			});
		}
	})
});





// 单天备份
router.get('/backupToManual', (req, res) => {
	const { tel, time } = req.query;

	// 查询 info 表中对应 tel 和 time 的所有数据，包含 msg 字段
	const selectSql = `
			SELECT id, tel, time, day, isActive, money, type, remarks, msg
			FROM info
			WHERE tel = ? AND time = ?
	`;

	db.query(selectSql, [tel, time], (err, results) => {
		if (err) {
			console.error('查询数据时出错:', err);
			res.status(500).send({ code: 500, msg: '查询数据失败', error: err });
			return;
		}

		if (results.length === 0) {
			res.send({ code: 200, msg: '没有找到需要备份的数据' });
			return;
		}

		// 遍历查询结果，逐条插入到 manual_backup 表
		let insertedCount = 0;
		let skippedCount = 0;

		const insertPromises = results.map(row => {
			return new Promise((resolve, reject) => {
				// 检查 manual_backup 表中是否已存在相同 info_id 的记录
				const checkSql = `SELECT COUNT(*) AS count FROM manual_backup WHERE info_id = ?`;
				db.query(checkSql, [row.id], (err, checkResults) => {
					if (err) {
						reject(err);
						return;
					}

					if (checkResults[0].count > 0) {
						// 如果已存在，跳过插入
						skippedCount++;
						resolve();
					} else {
						// 如果不存在，插入新记录，包含 msg 字段
						const insertSql = `
													INSERT INTO manual_backup (info_id, tel, time, day, isActive, money, type, remarks, msg)
													VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
											`;
						db.query(insertSql, [
							row.id,
							row.tel,
							row.time,
							row.day,
							row.isActive,
							row.money,
							row.type,
							row.remarks,
							row.msg
						], (err, result) => {
							if (err) {
								reject(err);
							} else {
								insertedCount++;
								resolve();
							}
						});
					}
				});
			});
		});

		// 等待所有插入操作完成
		Promise.all(insertPromises)
			.then(() => {
				res.send({ code: 200, msg: '备份完成', insertedCount, skippedCount });
			})
			.catch(err => {
				console.error('插入备份时出错:', err);
				res.status(500).send({ code: 500, msg: '备份失败', error: err });
			});
	});
});

// 新增时间段备份接口
router.get('/backupToManualByRange', (req, res) => {
	const { tel, startDate, endDate } = req.query;

	// 查询 info 表中对应 tel 和时间段的所有数据，包含 msg 字段
	const selectSql = `
			SELECT id, tel, time, day, isActive, money, type, remarks, msg
			FROM info
			WHERE tel = ? AND time BETWEEN ? AND ?
	`;

	db.query(selectSql, [tel, startDate, endDate], (err, results) => {
		if (err) {
			console.error('查询数据时出错:', err);
			res.status(500).send({ code: 500, msg: '查询数据失败', error: err });
			return;
		}

		if (results.length === 0) {
			res.send({ code: 200, msg: '没有找到需要备份的数据' });
			return;
		}

		// 遍历查询结果，逐条插入到 manual_backup 表
		let insertedCount = 0;
		let skippedCount = 0;

		const insertPromises = results.map(row => {
			return new Promise((resolve, reject) => {
				// 检查 manual_backup 表中是否已存在相同 info_id 的记录
				const checkSql = `SELECT COUNT(*) AS count FROM manual_backup WHERE info_id = ?`;
				db.query(checkSql, [row.id], (err, checkResults) => {
					if (err) {
						reject(err);
						return;
					}

					if (checkResults[0].count > 0) {
						// 如果已存在，跳过插入
						skippedCount++;
						resolve();
					} else {
						// 如果不存在，插入新记录，包含 msg 字段
						const insertSql = `
													INSERT INTO manual_backup (info_id, tel, time, day, isActive, money, type, remarks, msg)
													VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
											`;
						db.query(insertSql, [
							row.id,
							row.tel,
							row.time,
							row.day,
							row.isActive,
							row.money,
							row.type,
							row.remarks,
							row.msg
						], (err, result) => {
							if (err) {
								reject(err);
							} else {
								insertedCount++;
								resolve();
							}
						});
					}
				});
			});
		});

		// 等待所有插入操作完成
		Promise.all(insertPromises)
			.then(() => {
				res.send({ code: 200, msg: '备份完成', insertedCount, skippedCount });
			})
			.catch(err => {
				console.error('插入备份时出错:', err);
				res.status(500).send({ code: 500, msg: '备份失败', error: err });
			});
	});
});
//恢复！
// 恢复数据的接口

// 查询 manual_backup 和 auto_backup 表中的数据
const getCombinedData = (tel, startDate, endDate) => {
	return new Promise((resolve, reject) => {
		// 查询 manual_backup 表，使用 DATE_FORMAT 函数格式化日期
		const queryManual = `
					SELECT tel, DATE_FORMAT(time, '%Y-%m-%d') as time, day, isActive, money, type, remarks, info_id, msg
					FROM manual_backup
					WHERE tel = ? AND time BETWEEN ? AND ?
			`;

		// 查询 auto_backup 表，使用 DATE_FORMAT 函数格式化日期
		const queryAuto = `
					SELECT tel, DATE_FORMAT(time, '%Y-%m-%d') as time, day, isActive, money, type, remarks, info_id
					FROM auto_backup
					WHERE tel = ? AND time BETWEEN ? AND ?
			`;

		// 执行查询
		db.query(queryManual, [tel, startDate, endDate], (err, manualData) => {
			if (err) return reject(err);

			db.query(queryAuto, [tel, startDate, endDate], (err, autoData) => {
				if (err) return reject(err);

				// 合并数据并去重
				const combinedData = [...manualData, ...autoData];
				const uniqueData = {};
				combinedData.forEach((item) => {
					const key = `${item.tel}_${item.time}_${item.money}_${item.type}_${item.isActive}`;
					if (!uniqueData[key]) {
						uniqueData[key] = item;
					}
				});

				resolve(Object.values(uniqueData));
			});
		});
	});
};

// 恢复数据的接口
router.get('/restoreFromManualByRange', async (req, res) => {
	const { tel, startDate, endDate } = req.query;

	// 参数校验
	if (!tel || !startDate || !endDate) {
		return res.status(400).json({ code: 400, msg: '参数缺失' });
	}

	try {
		// 获取合并后的数据
		const combinedData = await getCombinedData(tel, startDate, endDate);

		// 插入数据到 info 表
		let insertedCount = 0;
		for (const item of combinedData) {
			// 检查是否已存在
			const checkQuery = `
							SELECT id FROM info
							WHERE tel = ? AND time = ? AND money = ? AND type = ? AND isActive = ?
					`;
			const results = await new Promise((resolve, reject) => {
				db.query(checkQuery, [item.tel, item.time, item.money, item.type, item.isActive], (err, results) => {
					if (err) return reject(err);
					resolve(results);
				});
			});

			if (results.length === 0) {
				// 插入数据
				const insertQuery = `
									INSERT INTO info (tel, time, day, isActive, money, type, remarks, msg)
									VALUES (?, ?, ?, ?, ?, ?, ?, ?)
							`;
				await new Promise((resolve, reject) => {
					db.query(
						insertQuery,
						[item.tel, item.time, item.day, item.isActive, item.money, item.type, item.remarks, item.msg || ''],
						(err) => {
							if (err) return reject(err);
							resolve();
						}
					);
				});
				insertedCount++;
			}
		}

		res.json({
			code: 200,
			msg: `恢复成功，共恢复 ${insertedCount} 条数据`,
		});
	} catch (err) {
		console.error('恢复失败:', err);
		res.status(500).json({ code: 500, msg: '恢复失败，请稍后重试' });
	}
});










// 修改用户信息
router.get('/editUserInfo', (req, res) => {
	var sql = `update users set paw='${req.query.paw}' where id=${req.query.id}`;
	console.log(req);
	db.query(sql, function (err, data) {
		if (err) {
			console.log(err, "v")
			res.send("修改失败 " + err);
		} else {
			// res.redirect("/users");
			console.log(data, "a")
			res.send({
				msg: "修改成功",
				code: 200

			});
		}
	})
});

// 用户管理
// 获取所有用户
router.get('/getUser', (req, res) => {
	let sql1 = `select * from users`
	db.query(sql1, function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});
// 搜索用户
router.get('/getUserSearch', (req, res) => {
	console.log(req.query)
	// 查询用户语句
	let sql = `select * from users where tel REGEXP '${req.query.tel}'`
	db.query(sql, (err, data) => {
		if (err) {
			console.log(err);
			return res.json({
				code: 500,
				msg: '搜索失败'
			})
		} else {
			console.log(data)
			res.send({
				list: data,
				code: 200,
				msg: "搜索成功"
			});
		}
	})
});

// 修改用户
router.get('/updatePost', (req, res) => {
	var sql = `update users set paw='${req.query.paw}' where id='${req.query.id}'`;
	console.log(req);
	db.query(sql, function (err, data) {
		if (err) {
			console.log(err, "v")
			res.send("修改失败 " + err);
		} else {
			// res.redirect("/users");
			console.log(data, "a")
			res.send({
				msg: "修改成功",
				code: 200

			});
		}
	})
});

// 删除用户
router.get('/delUser', (req, res) => {
	let sql = `delete from users where id = ${req.query.id}`;
	db.query(sql, (err, data) => {
		if (err) {
			console.log(err)
			res.send({
				code: 500,
				msg: "删除失败"
			})
		} else {
			res.send({
				code: 200,
				msg: "删除成功"
			})
		}
	})
});

// 获取所有记账
router.get('/getJizhang', (req, res) => {
	let sql1 = `select * from info`
	db.query(sql1, function (err, data) {
		if (err) {
			res.send({
				msg: "查询失败",
				code: 500
			});
		} else {
			res.send({
				list: data,
				msg: "查询成功！",
				code: 200
			});
		}
	});
});

// 删除记账
router.get('/delJizhang', (req, res) => {
	let sql = `delete from info where id = ${req.query.id}`;
	db.query(sql, (err, data) => {
		if (err) {
			console.log(err)
			res.send({
				code: 500,
				msg: "删除失败"
			})
		} else {
			res.send({
				code: 200,
				msg: "删除成功"
			})
		}
	})
});

// 搜索记账
router.get('/getJizhangSearch', (req, res) => {
	console.log(req.query)
	let sql = `select * from info where tel REGEXP '${req.query.tel}'`
	db.query(sql, (err, data) => {
		if (err) {
			console.log(err);
			return res.json({
				code: 500,
				msg: '搜索失败'
			})
		} else {
			console.log(data)
			res.send({
				list: data,
				code: 200,
				msg: "搜索成功"
			});
		}
	})
});

// 删除记账
router.get('/delJizhang', (req, res) => {
	let sql = `delete from info where id = ${req.query.id}`;
	db.query(sql, (err, data) => {
		if (err) {
			console.log(err)
			res.send({
				code: 500,
				msg: "删除失败"
			})
		} else {
			res.send({
				code: 200,
				msg: "删除成功"
			})
		}
	})
});

module.exports = router;