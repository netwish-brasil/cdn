var Upload = function (file) {
  this.file = file;
};

Upload.prototype.getType = function () {
  return this.file.type;
};

Upload.prototype.getSize = function () {
  return this.file.size;
};

Upload.prototype.getName = function () {
  return this.file.name;
};

Upload.prototype.progressHandling = function (event) {
  var percent = 0;
  var position = event.loaded || event.position;
  var total = event.total;
  if (event.lengthComputable) {
    percent = Math.ceil(position / total * 100);
  }
  // update progressbars classes so it fits your code
  $(".progress-bar").css("width", +percent + "%");
  $(".progressbar-text").text(percent + "%");
};

function dropbox_upload_session_start(file) {

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "https://content.dropboxapi.com/2/files/upload_session/start",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": "Bearer ZrMoWpiDhEAAAAAAAAAAEUHZPtpK-a00_wqCtzyrjoyY6LGNTKt_XP4kPrQ8WJoX",
        "Dropbox-API-Arg": JSON.stringify({
          "close": false
        })
      },
      success: function (res) {
        resolve({ 'error': false, "response": res });
      },
      error: function (res) {
        reject({ 'error': true, "response": res });
      },
      async: true,
      cache: false,
      contentType: false,
      processData: false
    });
  });
};

function dropbox_upload_session_upload(session, file) {
  return new Promise((resolve, reject) => {
    var that = file;

    $.ajax({
      type: "POST",
      url: "https://content.dropboxapi.com/2/files/upload_session/append_v2",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": "Bearer ZrMoWpiDhEAAAAAAAAAAEUHZPtpK-a00_wqCtzyrjoyY6LGNTKt_XP4kPrQ8WJoX",
        "Dropbox-API-Arg": JSON.stringify({
          "cursor": {
            "session_id": session,
            "offset": 0
          },
          "close": false
        })
      },
      xhr: function () {
        var myXhr = $.ajaxSettings.xhr();
        if (myXhr.upload) {
          myXhr.upload.addEventListener('progress', that.progressHandling, false);
        }
        return myXhr;
      },
      success: function (res) {
        resolve({ 'error': false, "response": res });
      },
      error: function (res) {
        reject({ 'error': true, "response": res });
      },
      async: true,
      data: file.file,
      cache: false,
      contentType: false,
      processData: false
    });
  });
}

function dropbox_upload_session_commit(session, file, path) {

  return new Promise((resolve, reject) => {
    var nome = file.getName().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    $.ajax({
      type: "POST",
      url: "https://content.dropboxapi.com/2/files/upload_session/finish",
      headers: {
        "Content-Type": "application/octet-stream",
        "Authorization": "Bearer ZrMoWpiDhEAAAAAAAAAAEUHZPtpK-a00_wqCtzyrjoyY6LGNTKt_XP4kPrQ8WJoX",
        "Dropbox-API-Arg": JSON.stringify({
          "cursor": {
            "session_id": session,
            "offset": file.getSize()
          },
          "commit": {
            "path": path + "/" +  nome,
            "mode": "add",
            "autorename": true,
            "mute": false,
            "strict_conflict": false
          }
        })
      },
      success: function (res) {
        resolve({ 'error': false, "response": res });
      },
      error: function (res) {
        resolve({ 'error': true, "response": res });
      },
      async: true,
      cache: false,
      contentType: false,
      processData: false
    });
  })
}

function dropbox_download(path) {

  $.ajax({
    type: "POST",
    url: "https://api.dropboxapi.com/2/files/get_temporary_link",
    headers: {
      "Authorization": "Bearer ZrMoWpiDhEAAAAAAAAAAEUHZPtpK-a00_wqCtzyrjoyY6LGNTKt_XP4kPrQ8WJoX",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ "path": path }),
    success: function (data) {
      window.open(data.link);
    },
    error: function (error) {
      console.log(error);
    },
    cache: false,
    processData: false
  });
}

function dropbox_remove(path) {

  $.ajax({
    type: "POST",
    url: "https://api.dropboxapi.com/2/files/delete_v2",
    headers: {
      "Authorization": "Bearer ZrMoWpiDhEAAAAAAAAAAEUHZPtpK-a00_wqCtzyrjoyY6LGNTKt_XP4kPrQ8WJoX",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ "path": path }),
    success: function (data) {
      console.log(data);
    },
    error: function (error) {
      console.log(error);
    },
    cache: false,
    processData: false
  });
}