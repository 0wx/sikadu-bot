var express = require('express');
var ismobile = require('ismobilejs')
var router = express.Router();
var login = require('../controller/authenticate/login');
const post = require('../models/post');
const rp = require('request-promise')
const token = process.env.TOKEN || '977774002:AAHRSqKRqrFZmqe1pcFPiJYOVp2o7FbOf2A';
const telegram = require('telegraf');
const bot = new telegram(token)

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

/* GET users listing. */
router.post('/login', function (req, res, next) {
    
    var m = req.SmartPhone.isAny() ? '-m' : '';
    const username = req.body.username;
    let headArr = req.headers.referer.split('/');
    var id = headArr.indexOf('gagal') == -1 ? headArr[headArr.length - 1] : headArr[headArr.length - 2];
    login(username, req.body.password, id, username, hasil => {
       
        if (hasil.status) {
            var postData = new post(hasil.isi);
            postData.save()
            .then(back => {
                var pesan = "\n- Nama   : " + back.nama +
                            "\n- NIM    : " + back.nim +
                            "\n- Alamat : " + back.alamat +
                            "\n- Telp.  : " + back.telp +
                            "\n- Email  : " + back.email +
                            "\n- Dosen  : " + back.dosen

                console.log(back)
                bot.telegram.sendMessage(back.id, "✅ Berhasil Login!\n"+ pesan, {
                    parse_mode: "Markdown",
                    reply_markup: JSON.stringify({
                      keyboard: [
                        ["📄 Cetak KRS", "📃 Cetak Transkrip"]
                      ],
                      resize_keyboard: true
                    }),
                    disable_notification: true
                  })
                res.render('users' + m, {title: "Sukses!", username: hasil.isi.nama });
            })
            
            
        }
        else {

            let head = req.headers.referer.split('/');
            var gagal = head.indexOf('gagal') == -1 ? head[head.length - 1] : head[head.length - 2]
            res.redirect(301, '/' + gagal + '/gagal');
        }
    });

});

module.exports = router;