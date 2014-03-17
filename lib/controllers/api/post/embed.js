var session = require('../../lib/session'),
    colorTools = require('../../lib/colorTools'),
    embed   = require('../../lib/embed'),
    embedInfoParse = require('../../lib/embedInfoParse'),
    coverImageParse = require('../../lib/coverImageParse'),
    _ = require('lodash'),
    streamBuffers = require('stream-buffers');

module.exports = function(req, res){
    var id           = session.create(),
        body         = req.body,
        algorithm    = body.algorithm,
        cover        = body.cover,
        cover_name   = body.cover_name,
        info         = body.info,
        info_name    = body.info_name;
        
    if (!_.isString(info_name) || 
        !_.isString(info)      || 
        !_.isString(cover)     ||
        !_.isString(cover_name)||
        !_.isString(algorithm)) return res.send(400);

    var base64writer = new streamBuffers.WritableStreamBuffer();
        base64writer.on('close', function(){
            var result = 'data:image/png;base64,' + base64writer.getContents().toString('base64');
            coverImageParse(cover, function(image1){
                coverImageParse(result, function(image2){
                    var psnr = colorTools.PSNR(image1.data, image2.data);
                    if (psnr !== null) 
                        res.send( 200, {
                            data: result,
                            psnr: psnr
                        });
                    else res.send(400, {
                        message: 'IMAGES_DIMENSIONS_NO_MATCHED'
                    });
                });
            });
        });

    coverImageParse(cover, function(image){
        console.log('Cover image parsed')
        embedInfoParse(info, info_name, function(info){
            console.log('Embedding info parsed')
            var stream = embed(image, info, algorithm, function(fail_inf){
                res.send(400, fail_inf)
            })
            if (stream !== null) stream.pipe(base64writer);
        });
    }, function(err){
        res.send(400, {
            message: 'WRONG_FILE_TYPE'
        })
    });
}