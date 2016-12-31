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
          var newOption = app.addPollOption.createOptionEl('Option ' + optionNumber);

          form.insertBefore(newOption, addBtn.parentNode);

          var saveBtn = form.querySelector('.form__submit--disabled');
          if (saveBtn) {
            saveBtn.classList.remove('form__submit--disabled');
            saveBtn.removeAttribute('disabled');
          }
        });
      }
    },

    createOptionEl: function (labelText) {
      var optionLabel = document.createElement('label'),
        input = document.createElement('input');

      optionLabel.className = 'form__label';
      optionLabel.textContent = labelText;

      input.className = 'form__input';
      input.type = 'text';
      input.name = 'option';
      input.addEventListener('input', function () {
        this.setCustomValidity('');
      });

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
          var toggle = card.querySelector('.show-card-full');
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
                if (cardBody.classList.contains('is-hidden')) {
                  cardBody.classList.remove('is-hidden');
                }

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
          xhr.send('option=' + selectedOption + '&operation=vote');
        });
      }
    }
  },


  // Edit poll
  editPoll: {
    init: function () {
      var polls = [].slice.call(document.getElementsByClassName('card'));

      if (polls.length > 0) {
        polls.forEach(function (poll) {
          var pollId = poll.querySelector('.poll-question').getAttribute('data-poll-id');
          var saveBtn = poll.querySelectorAll('.form__submit')[0];
          var form = saveBtn.parentNode;

          saveBtn.addEventListener('click', function (e) {
            var inputEls = [].slice.call(form.querySelectorAll('.form__input'));

            if (inputEls.length > 0) {
              inputEls.forEach(function (inputEl) {
                if (!inputEl.value) {
                  inputEl.setCustomValidity('Please enter new option.');
                } else {
                  inputEl.setCustomValidity('');
                }
              });
            }

            if (form.checkValidity()) {
              e.preventDefault();

              var option = [];

              inputEls.forEach(function (inputEl) {
                option.push('option=' + inputEl.value);
              });

              var xhr = new XMLHttpRequest();

              xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                  if (xhr.status === 204) {
                    // create voted option
                    var votedForm = poll.querySelector('.form');

                    inputEls.forEach(function (inputEl) {
                      votedForm.appendChild(app.editPoll.createVotedOptionEl(inputEl.value));
                      form.removeChild(inputEl.parentNode);
                    });
                  }
                }
              }

              xhr.open('PUT', '/poll/' + pollId, true);
              xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              xhr.send(option.join('&') + '&operation=edit');
            }
          });
        });
      }
    },

    createVotedOptionEl: function (option) {
      var votedOptionEl = document.createElement('label');
      votedOptionEl.className = 'form__label form__label--bordered';

      var input = document.createElement('input');
      input.type = 'radio';
      input.className = 'form__radio';
      input.name = 'option';
      input.value = option;
      input.disabled = true;

      var text = document.createTextNode(option);

      votedOptionEl.appendChild(input);
      votedOptionEl.appendChild(text);

      return votedOptionEl;
    }
  },


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
  },


  sharePoll: {
    init: function () {
      var polls = [].slice.call(document.getElementsByClassName('card'));

      if (polls.length > 0) {
        polls.forEach(function (poll) {
          var pollId = poll.querySelector('.poll-question').getAttribute('data-poll-id');
          var shareBtn = poll.querySelector('.form__submit--secondary');

          shareBtn.addEventListener('click', function () {
            var TWITTER_BASE_URL = 'https://twitter.com/intent/tweet';
            var pollLink = window.location.href;

            var tweetContent = poll.querySelector('.poll-question').textContent;
            var tweetLink = TWITTER_BASE_URL  + '?url=' + pollLink + '&text=' + tweetContent;

            window.open(tweetLink, 'VotingAppWindow', 'width=600,height=300,resizable=yes,scrollbars=yes'); 
          });
        });
      }
    }
  },


  // Update password
  updatePassword: {
    init: function () {
      var cards = [].slice.call(document.getElementsByClassName('card'));

      if (cards.length > 0) {
        cards.forEach(function (card) {
          var form = card.querySelector('.form');
          var currentPasswordEl = card.querySelector('input[name="password"]'),
            newPasswordEl = card.querySelector('input[name="newPassword"]');

          var updateBtn = card.querySelector('input[type="submit"]');

          currentPasswordEl.addEventListener('input', function () {
            this.setCustomValidity('');
          });

          newPasswordEl.addEventListener('input', function () {
            this.setCustomValidity('');
          });

          updateBtn.addEventListener('click', function (e) {
            // Validate empty inputs
            if (!currentPasswordEl.value) {
              currentPasswordEl.setCustomValidity('Please enter your current password!');
            } else {
              currentPasswordEl.setCustomValidity('');
            }

            if (!newPasswordEl.value) {
              newPasswordEl.setCustomValidity('Please enter your new password!');
            } else if (newPasswordEl.value === currentPasswordEl.value) {
              newPasswordEl.setCustomValidity('New password must be different than current password!');
            } else {
              newPasswordEl.setCustomValidity('');
            }

            // if (!form.checkValidity()) {
            // e.preventDefault();
            // }
          })
        })
      }
    }
  }
};


// Loader
var LOADER = {
  loadFunctions: function (namespace) {
    var funcNames = document.body.getAttribute('data-page-funcs').split(/\s+/);

    funcNames.forEach(function (funcName) {
      var func = LOADER.util.camelCase(funcName);

      if (func && namespace[func] && namespace[func].init) {
        namespace[func].init();
      }
    });
  },

  util: {
    camelCase: function (value) {
      return value.replace(/-(.)/g, function (match, p1) {
        return p1.toUpperCase();
      });
    }
  }
};


// Load app's functions
LOADER.loadFunctions(app);