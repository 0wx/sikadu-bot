var cek = require('./loginSikadu')
var login = function (user, password, id, nim, cb) {
    const tabletojson = require('tabletojson').Tabletojson;
    cek(user, password, data => {
        if (data.status) {
            if (data.res.indexOf('Password Dan NIM Salah') == -1) {
                console.log(data.res)
                var dataSiswa = tabletojson.convert(data.res)[2];
                
                var nama = dataSiswa[0]['1'];
                var alamat = dataSiswa[1]['1'];
                var email = dataSiswa[2]['1'];
                var telp = dataSiswa[3]['1'];
                var dosen = dataSiswa[4]['1'].replace(/Send MyMail/g, '');

                var dataLengkap = {
                    id: id,
                    nama: nama,
                    nim: nim,
                    pass: password,
                    alamat: alamat,
                    email: email,
                    telp: telp,
                    dosen: dosen
                };
                cb({status: true, isi: dataLengkap})
            }
            else cb({status: false})
        }
        else cb({status: false})
    }).catch(err => {
        cb({status: false})
        console.log(err.message)
    })
    return
}

module.exports = login;