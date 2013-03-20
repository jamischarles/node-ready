// TODO: Test timeout, on failure.
// TODO: What happens when you want to test for 2 nodes?

//TODO: make other traversal engines available?
//TODO Add option to force polling until timeout and gather all nodes found?

/*
 * Module dependencies
 * 
 */ 
require('query-qwery'); //query fallback for old browsers
var query = require('query');

//first 2 params are required
module.exports = function(query_str, success, failure, cfg){
  cfg = cfg || {};
  failure = failure || function(){};

  //defaults
  var poll_interval = cfg.interval || 200; //poll the DOM every * ms.
  var failure_interval = (cfg.timeout * 1000) || (5 * 1000); //timeout after * seconds. Default is 5 seconds
  var debug = cfg.debug || false;
  var failure_timer;
  var poll_timer;

  //setup console.log replacement
  var debugLog = function(msg){
    //if window.console is avaialable, AND debug is set to true, output to the console.
    if(window.console && debug){
      console.log("Node-ready: " + msg);
    }
  };

  debugLog('query: ' + query_str);
  
  //set timeout

  

  var isElFound = function(el_query){
    return query.all(el_query);
  }
  
  var abortPolling = function(){
    //cancel poll timer
    debugLog(query_str + ' el not found. Aborting.')
    clearTimeout(poll_timer);
    failure(query_str);
  }

  var pollDom = function(){
    debugLog('polling for ' + query_str);
    var el_array = isElFound(query_str);

    //if yes, pass nodes to success
    if (el_array.length !== 0){
      debugLog(query_str + " found");
      //cancel timeout timer
      clearTimeout(failure_timer);

      success(el_array);
    } else {
      //if not found, poll again
      poll_timer = setTimeout(pollDom, poll_interval);
    }

  }

  //start timeout timer, start polling
  failure_timer = setTimeout(abortPolling, failure_interval);
  
  pollDom();

}

