const newman = require('newman');
const data = require('../../collections/login.json');

async function masuk(user, pass, cb) {
    data.item[0].request.body.urlencoded[0].value = user;
    data.item[0].request.body.urlencoded[1].value = pass;
    newman.run(
        {
            collection: data,
            reporters: [],
            noColor: true,
            disableUnicode: true
        },
        async function (err, summary) {
            err &&
                cb({ status: false })

            summary.run.executions.forEach(async function (execution) {
                try{
                    var cookiearr = execution.request.headers.members;
                    var sesion;
                    for(var i = 0; i < cookiearr.length; i++){
                        if(cookiearr[i].key === 'Cookie'){
                            sesion = cookiearr[i].value
                        }
                    }
                    var data = execution.response.stream.toString("utf8");
                    
                }
                catch(err){
                    cb({status: false})

                }
                finally{
                    cb({status: true, res: data, cookie: sesion})
                }
            });
        }
    );
    return
};

module.exports = masuk;