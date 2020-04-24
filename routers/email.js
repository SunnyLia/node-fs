const formidable = require('formidable');
exports.email = function (req, res) {
    res.render("customizeEmail")
}
exports.send = function (req, res) {
    console.log(req.query)
}
const nodemailer = require("nodemailer");
const schedule = require('node-schedule');
const superagent = require('superagent')
const cheerio = require('cheerio')
const charset = require("superagent-charset");
charset(superagent); //设置字符

var sendDate = "0 0 9 * * *";//设置发送时间
var fromPerson = "张张你大爷<1218294773@qq.com>" //发送者
var toPerson = "1326155622@qq.com" //接收者。可以发送多个用户，用逗号隔开

/* 发送邮件 */
function sendMail(from, to, subject, content) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',//这是qq邮箱,如果用163邮箱则为smtp.163.com
        secure: true,
        port: 465,
        auth: {
            user: '####',//发件人邮箱账号
            pass: '####' //发件人邮箱授权码
        }
    })

    transporter.sendMail({
        from: from,
        subject: subject,
        to: to,
        html: content
    }, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response)
    })
}

/* 
schedule参数讲解
* * * * * *
┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ |
│ │ │ │ │ └ dayOfWeek (0 - 7) (0 or 7 is Sun)
│ │ │ │ └───── month (1 - 12)
│ │ │ └────────── dayOfMonth (1 - 31)
│ │ └─────────────── hour (0 - 23)
│ └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
6个占位符从左到右分别代表：秒、分、时、日、月、周几
举例：
    每分钟的第30秒触发： '30 * * * * *'
    每小时的1分30秒触发 ：'30 1 * * * *'
    每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
    每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
    2020年的1月1日1点1分30秒触发 ：'30 1 1 1 2020 *'
    每周1的1点1分30秒触发 ：'30 1 1 * * 1'
*/

/* 定时发送 */
// function scheduleCronstyle() {
// schedule.scheduleJob(sendDate, () => {
// getNews()
// });
// }

/*爬取人民网新闻*/
function getNews() {
    superagent.get('http://news.people.com.cn/GB/28053/index.html').charset('gbk').end((err, res) => {
        if (err) {
            console.log(`热点新闻抓取失败 - ${err}`)
        } else {
            let $ = cheerio.load(res.text, { decodeEntities: false });
            let content = "";
            $('table .anavy').each((idx, ele) => {
                content += '<li><a href="' + $(ele).attr("href") + '" style="font-size:12px">' + $(ele).text() + '</a></li>'
            });
            let subject = $(".t12l12blackb")[0] //主题

            sendMail(fromPerson, toPerson, $(subject).text() + ' | 新闻早报', '<ul>' + content + '</ul>')
        }
    });
}