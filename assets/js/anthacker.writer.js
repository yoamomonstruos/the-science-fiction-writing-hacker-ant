/* Basic Little Stuffs */
var AntHacker = AntHacker || {
  Colony: {}
};

!function(global){
  'use strict';

  function Writer(options) {
    this.options = options || {};

    this.loadWritings("assets/files/hacking-ants.md").splitByParagraph();
  }

  Writer.prototype.loadWritings = function loadWritings(file) {
    var http = new XMLHttpRequest();
        http.open('GET', file, false);
        http.send(null);

        this.rawMarkdown = http.responseText;
    return this;
  }

  Writer.prototype.splitByParagraph = function splitByParagraph() {
    global.Paragraphs = this.rawMarkdown.split("\n\n");
    return this;
  }

  global.Writer = Writer;
}(AntHacker);