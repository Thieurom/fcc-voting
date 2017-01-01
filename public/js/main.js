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
  /****************************************************************************
   * Functions that will be loaded on all pages
   ****************************************************************************/
  common: {
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


  /****************************************************************************
   * Consist of functions related to poll
   ****************************************************************************/
  poll: {
    // Return all the polls' containers
    polls: function () {
      return [].slice.call(document.getElementsByClassName('card'));
    },


    // Vote poll
    vote: function () {
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
    },


    // Display poll result by bar chart
    showChart: function () {
      var polls = app.poll.polls();

      if (polls.length > 0) {
        polls.forEach(function (poll) {
          var toggle = poll.querySelector('.show-card-full');
          var pollChart = poll.querySelector('.card__body');
          var pollQuestion = poll.querySelector('.poll-question');

          if (toggle) {
            var pollId = pollQuestion.getAttribute('data-poll-id');

            toggle.addEventListener('click', function () {
              var votes = parseInt(poll.querySelector('.poll-stat__votes').textContent);

              if (votes > 0 && !poll.querySelector('canvas')) {
                var xhr = new XMLHttpRequest();
                var canvasEl = document.createElement('canvas');

                canvasEl.setAttribute('width', 300);
                canvasEl.setAttribute('height', 180);
                pollChart.appendChild(canvasEl);

                if (pollChart.classList.contains('is-hidden')) {
                  pollChart.classList.remove('is-hidden');
                }

                xhr.onreadystatechange = function () {
                  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                    var chartData = app.poll.utils.parseChartData(JSON.parse(xhr.responseText));
                    app.poll.utils.drawChartToCanvas(canvasEl, chartData);
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


    // Add options when creating new poll or edit existing polls
    addOption: function () {
      var addBtn = document.querySelector('.form__add-option');

      if (addBtn) {
        addBtn.addEventListener('click', function () {
          var form = addBtn.parentNode.parentNode;
          var optionNumber = form.querySelectorAll('.form__label').length + 1;
          var newOption = app.poll.utils.createNewOptionEl('Option ' + optionNumber);

          form.insertBefore(newOption, addBtn.parentNode);

          var saveBtn = form.querySelector('.form__submit--disabled');
          if (saveBtn) {
            saveBtn.classList.remove('form__submit--disabled');
            saveBtn.removeAttribute('disabled');
          }
        });
      }
    },


    // Edit existing polls
    edit: function () {
      var polls = app.poll.polls();

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
                      votedForm.appendChild(app.poll.utils.createVotedOptionEl(inputEl.value));
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


    // Delete existing poll
    delete: function () {
      var polls = app.poll.polls();

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
    },


    // Share poll via twitter
    share: function () {
      var polls = app.poll.polls();

      if (polls.length > 0) {
        polls.forEach(function (poll) {
          var pollId = poll.querySelector('.poll-question').getAttribute('data-poll-id');
          var shareBtn = poll.querySelector('.form__submit--secondary');

          shareBtn.addEventListener('click', function () {
            var TWITTER_BASE_URL = 'https://twitter.com/intent/tweet';
            var pollLink = window.location.href;

            var tweetContent = poll.querySelector('.poll-question').textContent;
            var tweetLink = TWITTER_BASE_URL + '?url=' + pollLink + '&text=' + encodeURIComponent(tweetContent);

            window.open(tweetLink, 'VotingAppWindow', 'width=600,height=300,resizable=yes,scrollbars=yes');
          });
        });
      }
    },


    // Utils
    utils: {
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
      },


      createNewOptionEl: function (labelText) {
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
    }
  },


  /****************************************************************************
   * Consist of functions related to user's actions
   ****************************************************************************/
  userAction: {
    action: function () {
      return document.querySelector('.card');
    },


    updatePassword: function () {
      var action = app.userAction.action();

      if (action) {
        var form = action.querySelector('.form');
        var currentPasswordEl = action.querySelector('input[name="password"]'),
          newPasswordEl = action.querySelector('input[name="newPassword"]');

        var updateBtn = action.querySelector('input[type="submit"]');

        currentPasswordEl.addEventListener('input', function () {
          this.setCustomValidity('');
        });

        newPasswordEl.addEventListener('input', function () {
          this.setCustomValidity('');
        });

        updateBtn.addEventListener('click', function (e) {
          // Validate inputs
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
        });
      }
    }
  }
};



// Loader
var LOADER = {
  fire: function (namespace, pageName, funcName, args) {
    var funcName = (funcName === undefined) ? 'init' : funcName;

    if (pageName && namespace[pageName] && typeof namespace[pageName][funcName] === 'function') {
      namespace[pageName][funcName](args);
    }
  },

  load: function (namespace) {
    var pageName = LOADER.util.camelCase(document.body.className);
    var funcNames = document.body.getAttribute('data-page-funcs')
      .split(/\s+/)
      .map(function (funcName) {
        return LOADER.util.camelCase(funcName);
      });

    // Load common functions
    LOADER.fire(namespace, 'common');

    // Then load main functions specific to current page
    funcNames.forEach(function (funcName) {
      LOADER.fire(namespace, pageName, funcName);
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
LOADER.load(app);