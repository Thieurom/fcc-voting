(function () {
  // Dismiss alert
  var alertEl = document.querySelector('.alert');

  if (alertEl) {
    var closeBtn = alertEl.querySelector('.alert__close');

    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      alertEl.parentNode.removeChild(alertEl);
    })
  }
  // =============== //


  var cards = [].slice.call(document.getElementsByClassName('card'));

  if (cards.length > 0) {
    // Ajax for polls
    cards.forEach(function (card) {
      var toggle = card.querySelector('.toggle-show');
      var cardBody = card.querySelector('.card__body');
      var remover = card.querySelector('.card__remover');
      var poll = card.querySelector('span[data-poll-id]');

      if (toggle) {
        var pollId = poll.getAttribute('data-poll-id');

        toggle.addEventListener('click', function () {
          cardBody.classList.remove('is-hidden');
          var votes = parseInt(card.querySelector('.poll__votes').textContent);

          if (votes > 0 && !card.querySelector('canvas')) {
            var xhr = new XMLHttpRequest();

            var canvasEl = document.createElement('canvas');
            canvasEl.setAttribute('width', 300);
            canvasEl.setAttribute('height', 180);
            cardBody.insertBefore(canvasEl, cardBody.lastChild);

            xhr.onreadystatechange = function () {
              if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var chartData = parseChartData(JSON.parse(xhr.responseText));
                drawChartToCanvas(canvasEl, chartData);
              }
            }

            xhr.open('GET', '/poll/' + pollId, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.send(null);
          }
        });

      }


      // Delete poll
      if (remover) {
        var pollId = poll.getAttribute('data-poll-id');

        remover.addEventListener('click', function () {
          // Make HTTP request with Delete method
          var xhr = new XMLHttpRequest();

          xhr.open('DELETE', '/poll/' + pollId, true);
          xhr.send(null);

          card.parentNode.removeChild(card);
        });
      }


      // Update poll for voting
      var voteBtn = document.querySelector('.vote-btn');

      if (voteBtn) {
        var pollId = poll.getAttribute('data-poll-id');
        var selectedOption = '';

        var options = document.querySelectorAll('input[name="option"]');
        options.forEach(function(option) {
          option.addEventListener('click', function() {
            selectedOption = option.value; 
          });
        });

        voteBtn.addEventListener('click', function (e) {
          e.preventDefault();

          var xhr = new XMLHttpRequest();

          xhr.open('PUT', '/poll/' + pollId, true);
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.send('option=' + selectedOption);
        });
      }
    });
  }
  // =============== //


  // Add more options
  const MAX_OPTIONS = 5;
  var addOption = document.querySelector('.form__subheading');

  if (addOption) {
    addOption.addEventListener('click', function () {
      var form = addOption.parentNode.parentNode;
      var optionNumber = form.querySelectorAll('.form__label').length;

      if (++optionNumber > MAX_OPTIONS) {
        window.alert('Poll has maximum ' + MAX_OPTIONS + ' options!');
      } else {
        var newOption = createOptionEl(form, 'Option ' + optionNumber);

        form.insertBefore(newOption, addOption.parentNode);
      }
    });
  }


  // Helpers
  function drawChartToCanvas(canvas, data) {
    var pollChart = new Chart(canvas, {
      type: 'horizontalBar',
      data: data
    });
  }


  function parseChartData(jsonData) {
    var optionNames = jsonData.options.map(function(option) {
      return option.option;
    });

    var optionValues = jsonData.options.map(function(option) {
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


  function createOptionEl(form, labelText) {
    // One poll has maximum 5 options.
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
})();