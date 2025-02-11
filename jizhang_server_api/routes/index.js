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
	// let sql1 = `select * from users where FIND_IN_SET('${req.query.user}', user)`  // 查找数据表中是否已经存在用户
	let sql2 = `INSERT INTO users(tel,paw) VALUES(?,?)` // 插入语句，将前端传递过来的手机号和密码插入到数据库中
	db.query(sql1, function(err, data) {
		if (err) {
			res.send({
				msg: "注册失败",
				code: 500
			});
		} else {
			if (data.length ==
				0) { // data 为查询出来的结果，如果查询的手机号不存在，将会返回一个空数据 所有此时 data[0]==undefined, 执行插入语句操作;
				db.query(sql2, [req.query.tel, req.query.paw], function(err, data) {
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
	let {
		tel,
		paw
	} = req.query;


	let sql = `select * from users where FIND_IN_SET('${tel}', tel)`
	db.query(sql, (err, data) => {
		if (err) {
			console.log(err);
			return res.json({
				code: -1,
				msg: '登录失败'
			})
		} else {
			console.log("c")
			console.log(data);
			// 当data数组不为空时，代表该手机号注册过，然后匹对密码
			if (data.length == 0) {
				// 当 data 为空数组时，代表该手机号没有注册
				res.send({
					data: data,
					code: 0,
					msg: "该用户没有注册"
				});
			} else {
				if (data[0].paw == paw) {
					res.send({
						data: data[0],
						code: 200,
						token: "jk1235468956dasldsa",
						msg: "登录成功！"
					});
				} else {
					res.send({
						code: 500,
						msg: "密码错误"
					});
				}
			}
		}
	})
});

// 获取本人记账信息
// router.get('/getInfo', (req, res) => {
// 	let sql1 = `select * from info where tel = '${req.query.tel}'`
// 	db.query(sql1, function(err, data) {
// 		if (err) {
// 			res.send({
// 				msg: "查询失败",
// 				code: 500
// 			});
// 		} else {
// 			res.send({
// 				list: data,
// 				msg: "查询成功！",
// 				code: 200
// 			});
// 		}
// 	});
// });

// 获取本人某月记账记录
router.get('/getInfo', (req, res) => {
	// console.log(req.query);
	let sql1 = `select * from info where tel = '${req.query.tel}' && time REGEXP '${req.query.yearNow}-${req.query.monthNow}'`
	db.query(sql1, function(err, data) {
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

// 根据类型本人某月记账记录
router.get('/getLeixing', (req, res) => {
	console.log(req.query);
	let sql1 = `select * from info where tel = '${req.query.tel}' and time REGEXP '${req.query.yearNow}-${req.query.monthNow}' and type = '${req.query.type}'`
	db.query(sql1, function(err, data) {
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

// 记一笔
router.get('/addInfo', (req, res) => {
  console.log(req.query);
  let sql =
    `INSERT INTO info(tel,isActive,money,msg,time,day,type,num) VALUES(?,?,?,?,?,?,?,?)`
  db.query(sql, [req.query.tel, req.query.isActive, req.query.money, req.query.msg, req.query.time, req.query.day, req
    .query.type, req.query.num], function(err, data) {
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
	db.query(sql1, function(err, data) {
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
	db.query(sql1, function(err, data) {
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
	db.query(sql1, function(err, data) {
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
  db.query(sql, [req.query.tel, req.query.budget, req.query.year, req.query.month], function(err, data) {
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
  db.query(sql, [req.query.budget, req.query.tel, req.query.year, req.query.month], function(err, data) {
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
  let sql =
    `update info set isActive='${req.query.isActive}', money='${req.query.money}', msg='${req.query.msg}', time='${req.query.time}', day='${req.query.day}', type='${req.query.type}', num='${req.query.num}' where id=${req.query.id}`
  db.query(sql, [req.query.isActive, req.query.money, req.query.msg, req.query.time, req.query.day, req
    .query.type, req.query.num], function(err, data) {
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

// 根据记账id删除记账
router.get('/delInfo', (req, res) => {
	console.log(req.query);
	let sql1 = `delete from info where id = ${req.query.id}`
	db.query(sql1, function(err, data) {
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

// 修改用户信息
router.get('/editUserInfo', (req, res) => {
	var sql = `update users set paw='${req.query.paw}' where id=${req.query.id}`;
	console.log(req);
	db.query(sql, function(err, data) {
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
	db.query(sql1, function(err, data) {
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
	db.query(sql, function(err, data) {
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
	db.query(sql1, function(err, data) {
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