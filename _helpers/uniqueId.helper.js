const appConfig = require('../_models/appConfig.model');
exports.genrate = (type) => {
    return new Promise((resolve, reject) => {
        appConfig.findOne({}).then((config) => {
            if (type === 'user') {
                let nextNumber = config.userSr
                appConfig.updateOne({ _id: config._id }, { $inc: { userSr: 1 } }).then((updated) => {
                    console.log('Successfully Updated.')
                }).catch((err) => {
                    reject(err)
                })
                resolve(nextNumber + "")
            } else {
                reject("Invalid type of registration can't process unique id for " + type);
            }
        }).catch((err) => {
            reject(err)
        })
    });
}