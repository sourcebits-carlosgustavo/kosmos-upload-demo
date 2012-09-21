$(function(){
  // initialize filestyle
  $(":file").filestyle();

  function setProgress(perc){
    $("#progressBar").removeClass("hidden").find(".bar").css("width", perc+"%");  
  }

  function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  function dumpText(text){
    var d = new Date();
    var html = '<p><b>'+(d.getHours()+':'+d.getMinutes()+':'+d.getSeconds())+'</b>: '+text+'</p>';
    $("#output").html(html + $("#output").html());
  }

  $("#uploadForm").submit(function(){
    var files = $("#fileInput").get(0).files;
    
    // only continues if file has been selected
    if(files.length !== 1){
      dumpText('Please select a file…');
      return false;
    }

    var file = files[0];

    // check file type
    if(file.type != "video/mp4" && !confirm("WARNING - file type isn't MP4")){
      return false;
    }
    
    dumpText("Uploading file <b>"+file.name+"</b> with filesize: <b>"+ bytesToSize(file.size) +"</b>");

    var xhr = new XMLHttpRequest();
    var upl = xhr.upload;

    upl.addEventListener('progress', function (e){
      if (e.lengthComputable) {
        setProgress((e.loaded / e.total) * 100);
      }
    }, false);

    upl.addEventListener('load', function (e){
      dumpText("Upload complete!");
      setProgress(100);
    }, false);

    upl.addEventListener("error", function (e){
      dumpText("Error uploading!");
      setProgress(0);
    }, false);

    xhr.onload = function(){
      if(this.status === 200){
        dumpText("File link: <a href='"+this.responseText+"' target='_blank'>"+this.responseText+"</a>");
      }
    };

    xhr.open("POST", "upload.php");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("X-File-Name", file.name);
    xhr.send(file);
    
    return false;
  });

});