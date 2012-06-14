//
// Atto Outliner : convert text markup to nested HTML list tags
//
// author: Ryan Corradini
// version: 2.0 (AMD)
// date: 14 Jun 2012
// license: MIT
//

define(
    function() {

        // temporary globals (will be cleaned up at the bottom)
        var _indentChars = " \t*-";
        var _listLevels = {};


        // polyfill String.trimRight if necessary
        if (typeof String.prototype.trimRight == 'undefined') {
            String.prototype.trimRight = function() {
                return this.replace(/[\s\xA0]+$/, '');
            };
        }

        function checkIndentation(line) {
            for (var i=0, linelen=line.length; i<linelen; i++) {
                if (_indentChars.indexOf(line[i]) == -1) {
                    break;
                }
            }
            line = line.slice(i);
            return [line, i];
        }

        function createSimpleList(shimNode) {
            var listTag = (shimNode.className.indexOf('ordered') > -1) ? 'ol' : 'ul',
            listNode = null,
            taskDefs = shimNode.innerHTML.split('\n'),
            taskCount = taskDefs.length,
            currList = null,
            newList = null,
            currIndent = -1,
            lineinfo = [],
            nd = null;

            currList = listNode = document.createElement(listTag);

            for (var i=0; i<taskCount; i++) {
              var s = taskDefs[i].trimRight();
              if (s) {
                lineinfo = checkIndentation(s);
                if (lineinfo && lineinfo.length >= 2) {
                  if (currIndent == -1) {
                    currIndent = lineinfo[1];
                    _listLevels[currIndent] = currList;
                  } else if (lineinfo[1] > currIndent) {
                    newList = document.createElement(listTag);
                    currList.appendChild(newList);
                    currList = newList;
                    currIndent = lineinfo[1];
                    _listLevels[currIndent] = currList;
                  } else if (lineinfo[1] < currIndent) {
                    //console.log('less indentation');
                    currIndent = lineinfo[1];
                    currList = _listLevels[currIndent] || currList.parentNode;
                  }
                  //console.log("inserting item '"+lineinfo[0]+"' into node:",currList);
                  nd = document.createElement('li');
                  nd.innerHTML = lineinfo[0];
                  currList.appendChild(nd);
                } else {
                  console.log("ugh; checkIndentation is busticated.");
                }
              } /* endif(s) */
            } /* endfor */
            shimNode.parentNode.replaceChild(listNode, shimNode);
            //shimNode.parentNode.appendChild(listNode);
        }

        return createSimpleList;
    } // end function
);
