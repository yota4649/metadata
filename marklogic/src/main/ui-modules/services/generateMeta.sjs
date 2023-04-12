//declareUpdate();

function get(context, params) {
  xdmp.log("---------- generateMeta get --------");
  xdmp.log(params);

  return params
};

function put(context, params, input) {

  //xdmp.log("---------- generateMeta put --------");
  //xdmp.log(params);

  var tagList = params.tagList;
  var tagListSeq = fn.tokenize(tagList, ",")


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

    let fileName = fn.tokenize(uri, "\\.").toArray();
    let fileExt = fileName[fileName.length-1];

    newMeta.envelope.instance.Manual.fileType = fileExt; 

    let content = xdmp.documentFilter(cts.doc(uri));
    let author = content.xpath("//html:html/html:head/html:meta[@name='Author']/@content",
                                    {"html":"http://www.w3.org/1999/xhtml" });
    if (author) {
        newMeta.envelope.instance.Manual.author = author;
    }

    let title = content.xpath("//html:html/html:head/html:title",
                                    {"html":"http://www.w3.org/1999/xhtml" });
    if (title) {
        newMeta.envelope.instance.Manual.title = title;
    }

    newMeta.envelope.instance.Manual.shortContent = fn.substring(content, 0, 400)
    newMeta.envelope.instance.Manual.content=content;

    let collections = ["Meta","data"];
    collections.push(fileExt);
    for (let tag of tagListSeq ){
        tag= fn.stringJoin(fn.tokenize(tag, " "),'');   //remove space
        collections.push(tag);
    }
  
    var perm = xdmp.documentGetPermissions(uri);   // get oritinal permissions
  
    let newuri = uri + ".json";
    generatedUris.push(newuri);

    xdmp.documentInsert(newuri, newMeta,
                        {permissions : perm, collections : collections, quality : 10});

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
