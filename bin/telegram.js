const Telegraf = require('telegraf');
const mainHost = 'https://sikadu.herokuapp.com/';
const bot = new Telegraf(process.env.TOKEN || '0000000:token-bot-mu');
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const cekdb = require('../controller/cek/cekdb');
const loginSikadu = require('../controller/authenticate/loginSikadu');
const cetak_krs = require('../controller/cetak/krs');
const cetak_transkrip = require('../controller/cetak/transkrip');
const fs = require('fs');

function encode(x){
  return Buffer(x, 'utf8').toString('hex');
};

function decode(x){
  return Buffer(x, 'hex').toString('utf8');
};

//membuat link berdasarkan user id
function menuStart(user) {
  const menu = Telegraf.Extra
    .markdown()
    .markup((m) => m.inlineKeyboard([
      Markup.urlButton('🏫 Masuk ke Sikadu', mainHost + encode(user))
    ]));
  return menu;
}


bot.start(async ctx => {
  var id = ctx.from.id;

  //cek on database
  cekdb(id, status => {

    // checking status : result (true) || false
    if (status) {
      console.log(status)

      // mengirim pesan ke user jika sudah terdaftar di bot
      ctx.telegram.sendMessage(status.id, `😊 Hai ${status.nama},\nAnda sudah terdaftar`, {
        parse_mode: "Markdown",
        reply_markup: JSON.stringify({
          keyboard: [
            ["📄 Cetak KRS", "📃 Cetak Transkrip"]
          ],
          resize_keyboard: true
        }),
        disable_notification: false
      });
    }

    
    else {

      //mengirim pesan ke user bahwa belum terdaftar
      ctx.reply(`Halo ${ctx.from.first_name},\nSepertinya kamu belum terdaftar`, menuStart(ctx.from.id))
    }
  });
});


bot.on('text', ctx => {
  let id = ctx.from.id;
  let text = ctx.update.message.text;
  cekdb(id, data => {


    if(data){

      // Exsekusi pesan

      if(text == "📄 Cetak KRS"){
        //login awal mengambil cookie
        loginSikadu(data.nim, data.pass, hasil => {
          
          if(hasil.status){

            //Mencetak KRS dalam bentuk pdf
            cetak_krs(data.nim, hasil.cookie, file => {
              
              //mengirim file ke user
              ctx.replyWithDocument({source: file}, {caption: 'Dicetak pada : '+new Date().toDateString()})
              .then(() => {
                fs.unlinkSync(file);
              })
            })
          }
          else ctx.reply('Ambil data gagal')
        })
      }
      else if(text == "📃 Cetak Transkrip"){
        //login awal mengambil cookie
        loginSikadu(data.nim, data.pass, hasil => {
          
          if(hasil.status){

            //Mencetak transkrip dalam bentuk pdf
            cetak_transkrip(data.nim, hasil.cookie, file => {
              
              //mengirim file ke user
              ctx.replyWithDocument({source: file}, {caption: 'Dicetak pada : '+new Date().toDateString()})
              .then(() => {
                fs.unlinkSync(file);
              })
            })
          }
          else ctx.reply('Ambil data gagal')
        })
      }
      else {
        ctx.reply('Perintah tidak dikenal')
      }



    }
    else ctx.reply(`Halo ${ctx.from.first_name},\nSepertinya kamu belum terdaftar`, menuStart(ctx.from.id))
  })
})


module.exports = bot;
