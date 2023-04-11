//declareUpdate();

function get(context, params) {
  xdmp.log("---------- updateCollections get --------");
  xdmp.log(params);

  var uri = params.uri;
  xdmp.log("uri : "+ uri);
  let collections = xdmp.documentGetCollections(uri);
  // return zero or more document nodes
  let response = {};

  response.instance = cts.doc(uri).root;
  response.collections = collections;
  return response
};

function put(context, params, input) {

  xdmp.log("---------- updateCollections put --------");
  xdmp.log(params);

  let response = {};

  var uri = params.uri;
  var cols = params.cols;
  var op = params.op;

  xdmp.log("uri : "+ uri);

  if (op == "Add") {
    xdmp.documentAddCollections( uri , cols);
  }
  if (op == "Remove") {
    xdmp.documentRemoveCollections( uri, cols);
  }

  context.outputTypes = ['application/json'];

  response.uri = uri;
  response.cols = cols;
  response.op = op;
  return response;;
};

function post (context, params, input) {
  // return at most one document node
  xdmp.log("---------- updateCollections post --------");
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
