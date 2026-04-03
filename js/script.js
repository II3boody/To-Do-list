$(document).ready(function () {
  const themeBtn = $("#theme-toggle");
  const body = $("body");

  function updateIcon(isDark) {
    themeBtn.text(isDark ? "☀️" : "🌙");
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.addClass("dark-mode");
    updateIcon(true);
  }

  themeBtn.on("click", function () {
    body.toggleClass("dark-mode");
    const isDark = body.hasClass("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcon(isDark);
  });

  const quotes = [
    "النجاح ليس نهائياً، والفشل ليس قاتلاً.",
    "الطريقة الوحيدة للقيام بعمل رائع هي أن تحب ما تفعله.",
    "لا تنتظر الفرصة، بل اصنعها.",
  ];

  function loadQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    $("#quote-text").text(random);
  }

  loadQuote();
  let savedTasks;
  function loadTasks() {
    savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    savedTasks.forEach((task) => {
      const $task = $(
        '<li class="task-item">' +
          '<div class="task-check"></div>' +
          '<span class="task-text">' +
          task.text +
          "</span>" +
          '<button class="delete-btn">×</button>' +
          "</li>",
      );
      if (task.done) $task.addClass("done");
      $("#task-list").append($task);
    });
    updateStats();
    checkEmpty();
  }

  loadTasks();

  function addTask() {
    const text = $("#task-input").val();
    if (text.trim() === "") return;
    const $task = $(
      '<li class="task-item">' +
        '<div class="task-check"></div>' +
        '<span class="task-text">' +
        text +
        "</span>" +
        '<button class="delete-btn">×</button>' +
        "</li>",
    );
    $("#task-list").append($task);
    $("#task-input").val("");
    savedTasks.push({ text, done: false });
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
    updateStats();
    applyFilter();
  }

  $("#add-btn").on("click", function () {
    addTask();
  });

  $("#task-input").on("keypress", function (e) {
    if (e.which === 13) addTask();
  });

  $("#task-list").on("click", ".task-check, .task-text", function () {
    $(this).closest(".task-item").toggleClass("done");
    const index = $(this).closest(".task-item").index();
    savedTasks[index].done = !savedTasks[index].done;
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
    updateStats();
    applyFilter();
  });

  $("#task-list").on("click", ".delete-btn", function () {
    $(this)
      .closest(".task-item")
      .fadeOut(300, function () {
        $(this).remove();
        updateStats();
        applyFilter();
        savedTasks.splice($(this).index(), 1);
        localStorage.setItem("tasks", JSON.stringify(savedTasks));
      });
  });

  $(".filter-btn").on("click", function () {
    $(".filter-btn").removeClass("active");
    $(this).addClass("active");
    applyFilter();
  });

  function applyFilter() {
    const filter = $(".filter-btn.active").data("filter");
    if (filter === "all") {
      $(".task-item").show();
    } else if (filter === "done") {
      $(".task-item").hide();
      $(".task-item.done").show();
    } else if (filter === "pending") {
      $(".task-item").hide();
      $(".task-item:not(.done)").show();
    }
    checkEmpty();
  }

  function updateStats() {
    const total = $(".task-item").length;
    const done = $(".task-item.done").length;
    $("#total-count").text(total);
    $("#done-count").text(done);
  }

  function checkEmpty() {
    if ($(".task-item:visible").length === 0) $("#empty-state").show();
    else $("#empty-state").hide();
  }
});
