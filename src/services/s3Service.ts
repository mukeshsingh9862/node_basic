import AWS from 'aws-sdk';

export const UploadedFileToAWS = (filename: string, data: Buffer | string, ContentType: 'image/jpeg' | 'image/jpg' | 'image/png' | 'video/mpeg' | 'application/pdf') => {

    const S3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    });

    return new Promise((resolve, reject) => {
        let num = Math.round(
            Math.pow(36, 10 + 1) - Math.random() * Math.pow(36, 10)
        )
            .toString(36)
            .slice(1);
        let imageName = num + filename.split(' ').join('');
        if (ContentType == "application/pdf") {
            imageName = filename
        }
        S3.upload({
            Bucket: process.env.S3_BUCKET_NAME || '',
            Key: imageName,
            Body: data,
            ContentType,
            ACL: "public-read-write"
        }, (err: any, dist: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(dist.Location)
            }
        })
    });
}

export const GetJsonDataFromAWS = (filename: string) => {

    const S3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    });

    return new Promise((resolve, reject) => {
        S3.getObject({
            Bucket: process.env.S3_BUCKET_NAME || '',
            Key: filename
        }, (err: any, data: any) => {
            if (err) {
                reject(err);
            } else {
                // @ts-ignore
                let json = JSON.parse(data.Body.toString('utf-8'));
                resolve(json);
            }
        })
    });
}

export const DeleteFileFromAWS = (filename: string) => {

    const S3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    });

    return new Promise((resolve, reject) => {
        S3.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME || '',
            Key: filename
        }, (err: any, data: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        })
    });
}