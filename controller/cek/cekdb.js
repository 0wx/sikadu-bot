const post = require('../../models/post');


async function cekdb(id, cb) {
  try {
      let idFound = await post.findOne({ id: id });
      if (idFound) cb(idFound);
      else  cb(false);
  }
  catch (err) {
      console.log(err);
      cb(false);
  }
  return

}

module.exports = cekdb;