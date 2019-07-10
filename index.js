const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const { Parser } = require('json2csv');

exports.handler = async (event, context) => {
    
    const fields = event.input.fields;
    const opts = { fields, unwind: event.input.unwind };
    try {
        const parser = new Parser(opts);
        var csv = parser.parse(event.input.data);     
    } catch (err) {
        return { statusCode: 500, body: "Parsing error" + err };
    }

    const params = {
        Bucket: event.input.bucketName,
        Key: event.input.fileName,
        Body: csv
    };
    try{
        s3Result = await putFileToS3(params);
    } catch (err) {
        return { statusCode: 500, body: err }
    }
    return { statusCode: 200, body: s3Result }
}

function putFileToS3(parameters) {
    return new Promise((resolve,reject) => {
        s3.upload(parameters, (err,data) => {
            if (err){
                reject(err);
            }
            else resolve(data)
        })
    })
}
