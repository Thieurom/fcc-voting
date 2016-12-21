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
      var pollId = poll.getAttribute('data-poll-id');

      if (toggle) {
        toggle.addEventListener('click', function () {
          var canvasEl = card.querySelector('canvas');

          cardBody.classList.toggle('is-hidden');

          if (!canvasEl) {
            var xhr = new XMLHttpRequest();

            canvasEl = document.createElement('canvas');
            canvasEl.setAttribute('width', 300);
            canvasEl.setAttribute('height', 180);
            cardBody.appendChild(canvasEl);

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
        remover.addEventListener('click', function () {
          // Make HTTP request with Delete method
          var xhr = new XMLHttpRequest();

          xhr.open('DELETE', '/poll/' + pollId, true);
          xhr.send(null);
          
          card.parentNode.removeChild(card);
        });
      }
    });
  }
  // =============== //


  // Helpers
  function drawChartToCanvas(canvas, data) {
    var pollChart = new Chart(canvas, {
      type: 'horizontalBar',
      data: data
    });
  }


  function parseChartData(jsonData) {
    var optionNames = Object.keys(jsonData.options);
    var optionValues = optionNames.map(function (optionName) {
      return jsonData.options[optionName];
    });

    return {
      labels: optionNames,
      datasets: [{
        label: 'Number of votes',
        data: optionValues
      }]
    };
  }
})();