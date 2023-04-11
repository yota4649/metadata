//declareUpdate();

function get(context, params) {
  xdmp.log("---------- generateMeta get --------");
  xdmp.log(params);

  return params
};

function put(context, params, input) {

  xdmp.log("---------- generateMeta put --------");
  xdmp.log(params);

  var tagList = params.tagList;
  xdmp.log("tagList : "+ tagList);

  var tagListSeq = fn.tokenize(tagList, ",")

  let collections = ["Meta","data"];
  for (let tag of tagListSeq ){
    tag= fn.stringJoin(fn.tokenize(tag, " "),'');
    collections.push(tag);

  }


  var generatedUris=[];

  for (let uri of cts.uris(null,null , cts.collectionQuery("type/all"))){
    var newMeta = {};
    newMeta.envelope = {};
    newMeta.envelope.headers = {};
    newMeta.envelope.headers.NoAccess = 0;
    newMeta.envelope.triples = [];
    newMeta.envelope.instance = {};
    newMeta.envelope.instance.Manual = {};
    newMeta.envelope.instance.Manual.assetID ="0"
    newMeta.envelope.instance.Manual.filePath = uri;
    newMeta.envelope.instance.Manual.updateDateTime = fn.currentDateTime();
    newMeta.envelope.instance.Manual.category = "Manual"; 
    let fileName =  fn.tokenize(uri, "\\.");
    newMeta.envelope.instance.Manual.fileType = fn.tail(fileName); 
    newMeta.envelope.instance.Manual.author
    let content = xdmp.documentFilter(cts.doc(uri));
    newMeta.envelope.instance.Manual.shortContent = fn.substring(content, 0, 400)
    newMeta.envelope.instance.Manual.content=content;
  
    var perm = xdmp.documentGetPermissions(uri);
  
    let newuri = uri + ".json";
    generatedUris.push(newuri);

    collections.push(fn.tail(fileName));
    xdmp.documentInsert(newuri, newMeta,{permissions : perm,
        collections : collections,
        quality : 10});

    xdmp.documentRemoveCollections(uri, "type/all")

  }


  context.outputTypes = ['application/json'];

  return generatedUris;
};


function returnErrToClient(statusCode, statusMsg, body)
{
  fn.error(null, 'RESTAPI-SRVEXERR', 
           Sequence.from([statusCode, statusMsg, body]));
};

exports.PUT = put;
exports.GET = get;
