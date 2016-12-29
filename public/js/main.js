/**
 * This client script includes all the functions needed for throughout all pages.
 * But for each page (or route), only neccessary functions will be loaded/executed.
 * In order to do that, each page has to indicate what functions will be loaded.
 * 
 * Example:
 * -------------
 * The page at path `/poll/{pollId}` in which user can make a vote will be like as below:
 * 
 *  <body data-page-funcs="vote-poll">
 *    ... markup ...
 *  </body>
 * 
 * Then when page is loaded, it loades along with function named `votePoll`.
 * Note that, the function names in body tag is hyphened, meanwhile the `real`
 * function names that will be loaded is camelCase.
 * 
 * --------------
 * 
 * Credit: Paul Irish - https://www.paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */


// App namespace
var app = {
  closeAlert: {
    init: function () {
      var alertEl = document.querySelector('.alert');

      if (alertEl) {
        var closeBtn = alertEl.querySelector('.alert__close');

        closeBtn.addEventListener('click', function () {
          alertEl.parentNode.removeChild(alertEl);
        });
      }
    }
  },


  // Add new option to new/existing poll
  addPollOption: {
    init: function () {
      var addBtn = document.querySelector('.form__add-option');

      if (addBtn) {
        addBtn.addEventListener('click', function () {
          var form = addBtn.parentNode.parentNode;
          var optionNumber = form.querySelectorAll('.form__label').length + 1;
          var newOption = app.addPollOption.createOptionEl(form, 'Option ' + optionNumber);

          form.insertBefore(newOption, addBtn.parentNode);
        });
      }
    },

    createOptionEl: function (form, labelText) {
      var optionLabel = document.createElement('label'),
        input = document.createElement('input');

      optionLabel.className = 'form__label';
      optionLabel.textContent = labelText;

      input.className = 'form__input';
      input.type = 'text';
      input.name = 'option';
      input.required = true;

      optionLabel.appendChild(input);

      return optionLabel;
    }
  },


  // Get the poll's votes data and draw chart to canvas
  getPollChart: {
    init: function () {
      var cards = [].slice.call(document.getElementsByClassName('card'));

      if (cards.length > 0) {
        cards.forEach(function (card) {
          var toggle = card.querySelector('.poll-question--has-result');
          var cardBody = card.querySelector('.card__body');
          var poll = card.querySelector('span[data-poll-id]');

          if (toggle) {
            var pollId = poll.getAttribute('data-poll-id');

            toggle.addEventListener('click', function () {
              var votes = parseInt(card.querySelector('.poll-stat__votes').textContent);

              if (votes > 0 && !card.querySelector('canvas')) {
                var xhr = new XMLHttpRequest();

                var canvasEl = document.createElement('canvas');
                canvasEl.setAttribute('width', 300);
                canvasEl.setAttribute('height', 180);
                cardBody.appendChild(canvasEl);

                xhr.onreadystatechange = function () {
                  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var chartData = app.getPollChart.parseChartData(JSON.parse(xhr.responseText));
                    app.getPollChart.drawChartToCanvas(canvasEl, chartData);
                  }
                }

                xhr.open('GET', '/poll/' + pollId, true);
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.send(null);
              }
            });
          }
        });
      }
    },

    drawChartToCanvas: function (canvas, data) {
      var pollChart = new Chart(canvas, {
        type: 'horizontalBar',
        data: data
      });
    },

    parseChartData: function (jsonData) {
      var optionNames = jsonData.options.map(function (option) {
        return option.option;
      });

      var optionValues = jsonData.options.map(function (option) {
        return option.vote;
      });

      return {
        labels: optionNames,
        datasets: [{
          label: 'Number of votes',
          data: optionValues
        }]
      };
    }
  },


  // Vote the poll
  votePoll: {
    init: function () {
      var voteBtn = document.querySelector('.form__submit');

      if (voteBtn) {
        var card = document.querySelector('.card');
        var poll = card.querySelector('span[data-poll-id]');
        var pollId = poll.getAttribute('data-poll-id');
        var selectedOption = '';

        var options = document.querySelectorAll('input[name="option"]');

        options.forEach(function (option) {
          option.addEventListener('click', function () {
            selectedOption = option.value;
          });
        });

        voteBtn.addEventListener('click', function (e) {
          e.preventDefault();

          var xhr = new XMLHttpRequest();

          xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 204) {
                poll.textContent = 'You just voted successfully!';
                var cardBody = card.querySelector('.card__body');
                card.removeChild(cardBody);
              } else {
                window.alert('You can vote only once for each poll!');
              }
            }
          }

          xhr.open('PUT', '/poll/' + pollId, true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.send('option=' + selectedOption);
        });
      }
    }
  },


  // Edit poll
  /*
  editPoll: {
    init: function () {
      var saveBtn = document.querySelector('.save');

      if (saveBtn) {
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 204) {

            }
          }
        }

        xhr.open('PUT', '/poll/' + pollId, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // xhr.send('options='  )
      }
    }
  },
  */


  // Delete poll
  deletePoll: {
    init: function () {
      var polls = [].slice.call(document.getElementsByClassName('card'));

      if (polls.length > 0) {
        polls.forEach(function (poll) {
          var pollId = poll.querySelector('.poll-question').getAttribute('data-poll-id');
          var deleteBtn = poll.querySelector('.form__submit--secondary');

          deleteBtn.addEventListener('click', function () {
            var xhr = new XMLHttpRequest();

            xhr.open('DELETE', '/poll/' + pollId, true);
            xhr.send(null);

            poll.parentNode.removeChild(poll);
          })
        });
      }
    }
  }
};


// util
var util = {
  loadFunctions: function (namespace) {
    var funcNames = document.body.getAttribute('data-page-funcs').split(/\s+/);

    funcNames.forEach(function (funcName) {
      var func = util.camelCase(funcName);

      if (func && namespace[func] && namespace[func].init) {
        namespace[func].init();
      }
    });
  },

  camelCase: function (value) {
    return value.replace(/-(.)/g, function (match, p1) {
      return p1.toUpperCase();
    });
  }
};


// Load app's functions
util.loadFunctions(app);