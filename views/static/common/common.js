const moment = require("moment");
exports.dateFormat = function(date){
    return moment(date).format('YYYY/MM/DD hh:mm');
}