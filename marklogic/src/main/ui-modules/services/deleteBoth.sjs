//declareUpdate();

function get(context, params) {
  xdmp.log("---------- deleteBoth get --------");
  xdmp.log(params);

  var uri = params.uri;
  let length = fn.stringLength(uri);
  let docUri=fn.substring(uri,0, length-4);
  xdmp.log("delete both  : "+ uri +"           "+docUri);

  return uri
};

function put(context, params, input) {

  xdmp.log("---------- updateCollections put --------");
  xdmp.log(params);

};

function deleteFunction(context, params) {
  var uri = params.uri;
  xdmp.log("uri : "+ uri);

  xdmp.documentDelete(uri);
  let length = fn.stringLength(uri);
  let docUri=fn.substring(uri,0, length-4);
  xdmp.log("delete both  : "+ uri +"           "+docUri);
  xdmp.documentDelete(docUri);
  return "OK";
};

function returnErrToClient(statusCode, statusMsg, body)
{
  fn.error(null, 'RESTAPI-SRVEXERR', 
           Sequence.from([statusCode, statusMsg, body]));
};


exports.DELETE = deleteFunction;
exports.GET = get;
