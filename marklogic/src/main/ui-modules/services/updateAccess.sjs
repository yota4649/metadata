//declareUpdate();

function get(context, params) {
  xdmp.log("---------- updateNoAccess get --------");
  xdmp.log(params);

  var uri = params.uri;
  xdmp.log("uri : "+ uri);
  // return zero or more document nodes
  var doc = cts.doc(uri).root;
  return doc
};

function put(context, params, input) {

  xdmp.log("---------- updateNoAccess put --------");
  xdmp.log(params);

  var uri = params.uri;
  xdmp.log("uri : "+ uri);

  var doc = cts.doc(uri).toObject();
  var noa = doc.envelope.headers.NoAccess;
  xdmp.log("# of Access : "+noa);
  noa = noa + 1;
  var newdoc = doc;
  newdoc.envelope.headers.NoAccess = noa;
  var cols = xdmp.documentGetCollections(uri);  
  var perms = xdmp.documentGetPermissions(uri);

  xdmp.documentInsert(uri, newdoc, 
        {permissions : perms,
        collections : cols ,
        quality : 10});

  context.outputTypes = ['application/json'];


  return params;
};

function post (context, params, input) {
  // return at most one document node
  xdmp.log("---------- updateNoAccess post --------");
  xdmp.log(params);

  var uri = params.uri;
  xdmp.log("uri : "+ uri);
  return "OK";
};


function returnErrToClient(statusCode, statusMsg, body)
{
  fn.error(null, 'RESTAPI-SRVEXERR', 
           Sequence.from([statusCode, statusMsg, body]));
};

exports.POST = post;
exports.PUT = put;
exports.GET = get;
