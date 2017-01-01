/**
 * This client script includes all the functions needed for throughout all pages.
 * But for each page (or route), only neccessary functions will be loaded/executed.
 * In order to do that, each page has to indicate what functions will be loaded.
 * 
 * Example:
 * -------------
 * The page at path `/poll/{pollId}` in which user can make a vote will be like as below:
 * 
 *  <body class="poll" data-page-funcs="vote">
 *    ... markup ...
 *  </body>
 * 
 * Then when page is loaded, it loades along with app.poll.vote(),
 * provided that `app` is a namespace.
 * 
 * Other example, when the page at path `/login` is loaded, it executes
 * app.userAction.login():
 * 
 * <body class="user-action" data-paga-funcs="login">
 *  ... markup ...
 * </body>
 * 
 * Note that, the class name and function names in body tag is hyphened, meanwhile the `real`
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
    init: function () {
      var polls = app.poll.polls();

      if (polls.length > 0) {
        polls.forEach(function (poll) {
          var inputEls = [].slice.call(poll.querySelectorAll('.form__input'));

          if (inputEls.length > 0) {
            inputEls.forEach(function (inputEl) {
              if (inputEl.name === 'question') {
                inputEl.addEventListener('input', function () {
                  inputEl.setCustomValidity(app.validation.validatePollQuestion(inputEl));
                });
              } else if (inputEl.name === 'option') {
                inputEl.addEventListener('input', function () {
                  inputEl.setCustomValidity(app.validation.validatePollOption(inputEl));
                });
              }

            });
          }
        });
      }
    },


    // Return all the polls' containers
    polls: function () {
      return [].slice.call(document.getElementsByClassName('card'));
    },


    // Vote poll
    vote: function () {
      var poll = app.poll.polls()[0];

      if (poll) {
        var pollQuestion = poll.querySelector('.poll-question');
        var pollId = pollQuestion.getAttribute('data-poll-id');
        var voteBtn = poll.querySelector('.form__submit');

        var options = [].slice.call(poll.querySelectorAll('.form__radio'));
        var selectedOption = '';

        options.forEach(function (option) {
          option.addEventListener('click', function () {
            selectedOption = option.value;
          });
        });

        voteBtn.addEventListener('click', function (e) {
          e.preventDefault();

          if (!selectedOption) {
            window.alert('You must choose one option to vote!');
          } else {
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
          }
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


    // Create new poll
    create: function () {
      var polls = app.poll.polls();

      if (polls.length > 0) {
        var createBtn = polls[0].querySelector('.form__submit');

        createBtn.addEventListener('click', function () {
          var optionEls = [].slice.call(polls[0].querySelectorAll('.form__input'));

          optionEls.forEach(function (optionEl) {
            optionEl.setCustomValidity(app.validation.validatePollOption(optionEl));
          });
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
                inputEl.setCustomValidity(app.validation.validatePollOption(inputEl));
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
          input.setCustomValidity(app.validation.validatePollOption(input));
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
    init: function () {
      var action = app.userAction.action();

      if (action) {
        var inputEls = [].slice.call(action.querySelectorAll('.form__input'));

        if (inputEls.length > 0) {
          inputEls.forEach(function (inputEl) {
            inputEl.addEventListener('input', function () {
              if (inputEl.name === 'username') {
                inputEl.setCustomValidity(app.validation.validateUsername(inputEl));
              } else if (inputEl.name === 'password') {
                inputEl.setCustomValidity(app.validation.validatePassword(inputEl));
              } else if (inputEl.name === 'newPassword') {
                inputEl.setCustomValidity(app.validation.validateNewPassword(inputEl));
              }
            });
          });
        }
      }
    },


    action: function () {
      return document.querySelector('.card');
    },


    // Validate signup
    signup: function () {
      var action = app.userAction.action();

      if (action) {
        var usernameEl = action.querySelector('input[name="username"]'),
          passwordEl = action.querySelector('input[name="password"]');
        var signupBtn = action.querySelector('.form__submit');

        signupBtn.addEventListener('click', function () {
          usernameEl.setCustomValidity(app.validation.validateUsername(usernameEl));
          passwordEl.setCustomValidity(app.validation.validatePassword(passwordEl));
        });
      }
    },


    // Validate login
    login: function () {
      var action = app.userAction.action();

      if (action) {
        var usernameEl = action.querySelector('input[name="username"]'),
          passwordEl = action.querySelector('input[name="password"]');
        var loginBtn = action.querySelector('.form__submit');

        loginBtn.addEventListener('click', function () {
          usernameEl.setCustomValidity(app.validation.validateUsername(usernameEl));
          passwordEl.setCustomValidity(app.validation.validatePassword(passwordEl));
        });
      }
    },


    // Change password
    updatePassword: function () {
      var action = app.userAction.action();

      if (action) {
        var currentPasswordEl = action.querySelector('input[name="password"]'),
          newPasswordEl = action.querySelector('input[name="newPassword"]');

        var updateBtn = action.querySelector('.form__submit');

        updateBtn.addEventListener('click', function () {
          app.validation.validateChangePassword(currentPasswordEl, newPasswordEl);
        });
      }
    }
  },


  /****************************************************************************
   * Consist of functions related to form validation
   ****************************************************************************/
  validation: {
    validatePollQuestion: function (input) {
      var errorValidationMsg = '';

      if (!input.value) {
        errorValidationMsg = 'Poll question can\'t be left blank!';
      }

      return errorValidationMsg;
    },


    validatePollOption: function (input) {
      var errorValidationMsg = '';

      if (!input.value) {
        errorValidationMsg = 'Poll option can\'t be left blank!';
      }

      return errorValidationMsg;
    },


    validateUsername: function (input) {
      var errorValidationMsg = '';

      if (!input.value) {
        errorValidationMsg = 'Please enter your username!';
      } else if ((/\s/).test(input.value)) {
        errorValidationMsg = 'Username can\'t contain space(s)!';
      }

      return errorValidationMsg;
    },


    validatePassword: function (input) {
      var errorValidationMsg = '';

      if (!input.value) {
        errorValidationMsg = 'Please enter your password!';
      } else if ((/\s/).test(input.value)) {
        errorValidationMsg = 'Password can\'t contain space(s)!';
      }

      return errorValidationMsg;
    },


    validateNewPassword: function (input) {
      var errorValidationMsg = '';

      if (!input.value) {
        errorValidationMsg = 'Please enter your new password!';
      } else if ((/\s/).test(input.value)) {
        errorValidationMsg = 'Password can\'t contain space(s)!';
      }

      return errorValidationMsg;
    },


    validateChangePassword: function (oldPassword, newPassword) {
      if (!oldPassword.value) {
        oldPassword.setCustomValidity('Please enter your password!');
      } else if ((/\s/).test(oldPassword.value)) {
        oldPassword.setCustomValidity('Password can\'t contain space(s)!');
      } else if (!newPassword.value) {
        newPassword.setCustomValidity('Please enter your new password!');
      } else if ((/\s/).test(newPassword.value)) {
        newPassword.setCustomValidity('Password can\'t contain space(s)!');
      } else if (oldPassword.value === newPassword.value) {
        newPassword.setCustomValidity('New password must be different than currrent password!');
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
      LOADER.fire(namespace, pageName);
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