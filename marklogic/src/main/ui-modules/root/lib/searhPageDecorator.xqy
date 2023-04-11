xquery version "1.0-ml";

module namespace decolibsearch = "http://marklogic.com/demo/decolibsearch";

declare namespace sarqlRes = "http://www.w3.org/2005/sparql-results#";

import module namespace sem = "http://marklogic.com/semantics"
at "/MarkLogic/semantics.xqy";

import module namespace functx = "http://www.functx.com" at "/MarkLogic/functx/functx-1.0-nodoc-2007-01.xqy";

declare function decolibsearch:decorator($uri as xs:string) as node()*
{
    let $format := xdmp:uri-format($uri)
    let $mimetype := xdmp:uri-content-type($uri)
    let $collection := xdmp:document-get-collections($uri)[1]
    let $doc := fn:doc($uri)
    let $pdfUri := fn:tokenize($uri, ".json")[1]

  
    let $_:=xdmp:log("==========response=============  ")

    let $response := (
        attribute href {fn:concat("/v1/documents?uri=",xdmp:url-encode($uri))},
        attribute pdfhref {fn:concat("/v1/documents?uri=",xdmp:url-encode($pdfUri))},

        if (fn:empty($mimetype)) then ()
        else attribute mimetype {$mimetype},

        attribute filePath {$doc/envelope/instance/Manual/filePath/string()},  
        attribute update {$doc/envelope/instance/Manual/updateDateTime/string()},
        attribute fileType {$doc/envelope/instance/Manual/fileType/string()},
        attribute shortText {$doc/envelope/instance/Manual/shortContent/string()},
        attribute category {$doc/envelope/instance/Manual/category/string()},
        attribute noa {$doc/envelope/headers/NoAccess/string()},
        attribute partImage {$doc/envelope/instance/Manual/partImage/string()},
        attribute collections { xdmp:document-get-collections($uri) }
    )

    return $response
};
