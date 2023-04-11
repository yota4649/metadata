
function get (context, params) {

    let response = {};
    xdmp.log("====== assetDetailService ========")
    xdmp.log(params);
    let uri = params.uri;
    let Doc = cts.doc(uri).toObject();
    let instance = Doc.envelope.instance;
    let collections = xdmp.documentGetCollections(uri);
    xdmp.log(collections);

    if (instance) {
        response.instance = instance;
        response.collections = collections;
    }
    return response;
}

exports.GET = get;
