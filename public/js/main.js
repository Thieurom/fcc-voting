(function() {
  var cards = [].slice.call(document.getElementsByClassName('card'));

  cards.forEach(function(card) {
    var toggle = card.querySelector('.toggle-show');
    var cardBody = card.querySelector('.card__body');

    toggle.addEventListener('click', function(e) {
      var canvasEl = card.querySelector('canvas');

      e.preventDefault();
      cardBody.classList.toggle('is-hidden');

      if (!canvasEl) {
        var xhr = new XMLHttpRequest();
        var pollId = toggle.getAttribute('data-poll-id');

        canvasEl = document.createElement('canvas');
        canvasEl.setAttribute('width', 300);
        canvasEl.setAttribute('height', 180);
        cardBody.appendChild(canvasEl);

        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            var chartData = parseChartData(JSON.parse(xhr.responseText));
            drawChartToCanvas(canvasEl, chartData);
          }
        }

        xhr.open('GET', window.location.origin + '/api/poll/' + pollId, true);
        xhr.send(null);
      }
    });
  });


  function drawChartToCanvas(canvas, data) {
    var pollChart = new Chart(canvas, {
      type: 'horizontalBar',
      data: data
    });
  }


  function parseChartData(jsonData) {
    var optionNames = Object.keys(jsonData.options);
    var optionValues = optionNames.map(function(optionName) {
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