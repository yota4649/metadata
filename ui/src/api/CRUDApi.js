import { polyfill } from 'es6-promise';
import 'isomorphic-fetch';

polyfill();

var api = '/api/crud/';

// TODO: consider refactoring out to utils library with identical
// function in grove-vue-visjs-graph
function buildUrl(path, params) {
  var url = new URL(api + path, window.location.href);
  if (params) {
    Object.keys(params).forEach(key => {
      if (Array.isArray(params[key])) {
        params[key].map(param => url.searchParams.append(key, param));
      } else {
        url.searchParams.append(key, params[key]);
      }
    });
  }
  return url;
}

function buildCrudUrl(crudType, id, params, view) {
  const path =
    crudType +
    (id ? '/' + encodeURIComponent(id) : '') +
    (view ? '/' + view : '');
  return buildUrl(path, params);
}

// // copied from Angular.js
// function isObject(value) {
//   // http://jsperf.com/isobject4
//   return value !== null && typeof value === 'object';
// }

export default {
  name: 'CRUDApi',
  view(crudType, id, view, params) {

    console.log('yota CRUDapi.js crudType'); console.log(crudType);
    console.log(buildCrudUrl(crudType, id, params, view));
    let URL = buildCrudUrl(crudType, id, params, view);
    //return fetch(buildCrudUrl(crudType, id, params, view), 
    return fetch(URL, { method: 'GET', credentials: 'same-origin' })
           .then(
             response => {
	       console.log('Not Error');
	       console.log('-------------------------');
	       console.log(response);
	       console.log('-------------------------');
               return response.text().then(text => {
                 return { isError: false, response: text };
               });
             },
             error => { 
	       console.log('Error');
		     console.log(response);
		     return { isError: true, error: error }; }
    );
  },
  create(crudType, id, data, format, params) {
      console.log("++++++++++++++++++++++++ creeate +++++++++++++++++");
      console.log("id",id);
      console.log("crudType", crudType);
      console.log("format", format);
      console.log("params", params);
      console.log("data", data);
      console.log(data.type);
      console.log("built URL")
      params={};
      params.collection="test";
      console.log(buildCrudUrl(crudType, id, params));

    return fetch(buildCrudUrl(crudType, id, params), {
      method: 'POST',
      headers: {
        'content-type': data.type
          //'application/' + (format === 'binary' ? 'octet-stream' : format)
          //'application/' + (format === 'binary' ? 'binary' : format)
      },
      body: format === 'json' ? JSON.stringify(data) : data,
      credentials: 'same-origin'
    }).then(
      response => {
        var id = response.headers.get('location');
        return response.text().then(text => {
          if (response.status === 201) {
            return { isError: false, response: text, id: id };
          } else {
            return { isError: true, error: text, id: id };
          }
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  read(crudType, id, params) {
    return fetch(buildCrudUrl(crudType, id, params), {
      method: 'GET',
      credentials: 'same-origin'
    }).then(
      response => {
        return response.text().then(text => {
          return { isError: false, response: text };
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  update(crudType, id, data, format, params) {
    return fetch(buildCrudUrl(crudType, id, params), {
      method: 'PUT',
      headers: {
        'content-type':
          'application/' + (format === 'binary' ? 'octet-stream' : format)
      },
      body: format === 'json' ? JSON.stringify(data) : data,
      credentials: 'same-origin'
    }).then(
      response => {
        return response.text().then(text => {
          return { isError: false, response: text };
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  },
  delete(crudType, id, params) {
    return fetch(buildCrudUrl(crudType, id, params), {
      method: 'DELETE',
      credentials: 'same-origin'
    }).then(
      response => {
        return response.text().then(text => {
          if (response.status === 204) {
            return { isError: false, response: text };
          } else {
            return { isError: true, error: text };
          }
        });
      },
      error => {
        return { isError: true, error: error };
      }
    );
  }
};
