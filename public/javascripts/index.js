/**
 * Created by Somsak Arnon on 3/30/2017 AD.
 */

function getLogLine(params) {
  $.ajax({
    type: "POST",
    url: "/getloglines",
    data: params,
    beforeSend: function () {
      $("#loader").addClass("active");
    },
    success: function (html) {
      $("#dynamic-container").html(html);
    },
    complete: function () {
      $("#loader").removeClass("active");
    }
  });
}

$(function() {
  $("#view-btn").click(function() {
    getLogLine({
      path: $("#path-field").val(),
      page: 1
    });
  });

  $("#head-btn").click(function() {
    getLogLine({
      path: $("#path-field").val(),
      page: 1
    });
  });

  $("#prev-btn").click(function() {
    getLogLine({
      path: $("#path-field").val(),
      page: parseInt($("#dynamic-container [data-page]").attr("data-page") === undefined ? "2" : $("#dynamic-container [data-page]").attr("data-page")) - 1
    });
  });

  $("#next-btn").click(function() {
    getLogLine({
      path: $("#path-field").val(),
      page: parseInt($("#dynamic-container [data-page]").attr("data-page") === undefined ? "1" : $("#dynamic-container [data-page]").attr("data-page")) + 1
    });
  });

  $("#tail-btn").click(function() {

  });
});
