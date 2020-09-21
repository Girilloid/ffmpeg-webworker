var workerFile = function workerFile() {
  var workerPath = "https://raw.githack.com/Girilloid/ffmpeg/master/ffmpeg-all-codecs.js";
  importScripts(workerPath);
  var now = Date.now;

  function print(text) {
    postMessage({
      type: "stdout",
      data: text
    });
  }

  onmessage = function onmessage(event) {
    var message = event.data;

    if (message.type === "command") {
      var Module = {
        arguments: message.arguments || [],
        files: message.files || [],
        print: print,
        printErr: print,
        TOTAL_MEMORY: message.totalMemory || 33554432
      };
      postMessage({
        data: Module.arguments.join(" "),
        type: "start"
      });
      postMessage({
        data: "Received command: ".concat(Module.arguments.join(" ")).concat(Module.TOTAL_MEMORY ? ".  Processing with ".concat(Module.TOTAL_MEMORY, " bits.") : ""),
        type: "stdout"
      });
      var time = now();
      var result = ffmpeg_run(Module);
      var totalTime = now() - time;
      postMessage({
        data: "Finished processing (took " + totalTime + "ms)",
        type: "stdout"
      });
      postMessage({
        data: result,
        time: totalTime,
        type: "done"
      });
    }
  };

  postMessage({
    type: "ready"
  });
};

export default workerFile;