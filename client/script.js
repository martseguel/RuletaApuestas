$(document).ready(function () {
  //setup multiple rows of colours, can also add and remove while spinning but overall this is easier.
  initWheel();

  let socket = io()

  socket.on('roll', (num) => {
    spinWheel(num)
  })
  socket.on('remainingSecs', (remSecs) => {
    document.getElementById("countdown").innerHTML = remSecs;
  })
  socket.on('startProgressBar', (secs) => {
    var bar = document.querySelector(".round-time-bar");
    bar.classList.remove("round-time-bar");
    bar.offsetWidth;
    bar.style.setProperty("--duration", secs);
    bar.classList.add("round-time-bar");
  })
  socket.on('last100RollsInit', (last100RollsInit) => {
    initStats(last100RollsInit);
  })
  socket.on('newRollStat', (newRoll) => {
    addStatOnNewRoll(newRoll);
  })
});
function initWheel() {
  var $wheel = $('.roulette-wrapper .wheel'),
    row = "";

  row += "<div class='row'>";
  row += "  <div class='card red'>1<\/div>";
  row += "  <div class='card black'>14<\/div>";
  row += "  <div class='card red'>2<\/div>";
  row += "  <div class='card black'>13<\/div>";
  row += "  <div class='card red'>3<\/div>";
  row += "  <div class='card black'>12<\/div>";
  row += "  <div class='card red'>4<\/div>";
  row += "  <div class='card green'>0<\/div>";
  row += "  <div class='card black'>11<\/div>";
  row += "  <div class='card red'>5<\/div>";
  row += "  <div class='card black'>10<\/div>";
  row += "  <div class='card red'>6<\/div>";
  row += "  <div class='card black'>9<\/div>";
  row += "  <div class='card red'>7<\/div>";
  row += "  <div class='card black'>8<\/div>";
  row += "<\/div>";

  for (var x = 0; x < 29; x++) {
    $wheel.append(row);
  }
}

function spinWheel(roll) {
  var $wheel = $('.roulette-wrapper .wheel'),
    order = [0, 11, 5, 10, 6, 9, 7, 8, 1, 14, 2, 13, 3, 12, 4],
    position = order.indexOf(roll);

  //determine position where to land
  var rows = 12,
    card = 75 + 3 * 2,
    landingPosition = (rows * 15 * card) + (position * card);

  var randomize = Math.floor(Math.random() * 75) - (75 / 2);

  landingPosition = landingPosition + randomize;

  var object = {
    x: Math.floor(Math.random() * 50) / 100,
    y: Math.floor(Math.random() * 20) / 100
  };

  $wheel.css({
    'transition-timing-function': 'cubic-bezier(0,' + object.x + ',' + object.y + ',1)',
    'transition-duration': '6s',
    'transform': 'translate3d(-' + landingPosition + 'px, 0px, 0px)'
  });

  setTimeout(function () {
    $wheel.css({
      'transition-timing-function': '',
      'transition-duration': '',
    });

    var resetTo = -(position * card + randomize);
    $wheel.css('transform', 'translate3d(' + resetTo + 'px, 0px, 0px)');
  }, 6 * 1000);
}

var reds = 0;
var greens = 0;
var blacks = 0;
var last100Rolls = [];

function initStats(last100RollsParam) {
  last100Rolls = last100RollsParam;
  reds = 0;
  greens = 0;
  blacks = 0;
  var statNumRed = document.getElementById('redStatNum');
  var statNumGreen = document.getElementById('greenStatNum');
  var statNumBlack = document.getElementById('blackStatNum');

  for (var roll in last100RollsParam) {
    roll = last100RollsParam[roll];
    if (roll == 0) {
      greens++;
    } else if (roll <= 7) {
      reds++;
    } else if (roll <= 14) {
      blacks++;
    }
  }

  statNumRed.innerHTML = reds;
  statNumGreen.innerHTML = greens;
  statNumBlack.innerHTML = blacks;

  var last10Rolls = last100RollsParam.slice(-10);

  var $lastRollsDiv = $('.lastRolls');
  for (var roll in last10Rolls) {
    roll = last10Rolls[roll];
    if (roll == 0) {
      $lastRollsDiv.prepend('<span class="rollStat green greenStatImg">' + roll + '</span>');
    } else if (roll <= 7) {
      $lastRollsDiv.prepend('<span class="rollStat red redStatImg">' + roll + '</span>');
    } else if (roll <= 14) {
      $lastRollsDiv.prepend('<span class="rollStat black blackStatImg">' + roll + '</span>');
    }
  }
}

function addStatOnNewRoll(newRoll) {
  reds = 0;
  greens = 0;
  blacks = 0;
  var statNumRed = document.getElementById('redStatNum');
  var statNumGreen = document.getElementById('greenStatNum');
  var statNumBlack = document.getElementById('blackStatNum');

  if (last100Rolls > 100) {
    last100Rolls.shift();
  }
  last100Rolls.push(newRoll);

  var last10Rolls = last100Rolls.slice(-10);

  for (var roll in last10Rolls) {
    roll = last10Rolls[roll];
    if (roll == 0) {
      greens++;
    } else if (roll <= 7) {
      reds++;
    } else if (roll <= 14) {
      blacks++;
    }
  }

  statNumRed.innerHTML = reds;
  statNumGreen.innerHTML = greens;
  statNumBlack.innerHTML = blacks;

  var last10Rolls = last100RollsParam.slice(-10);

  var $lastRollsDiv = $('.lastRolls');
  for (var roll in last10Rolls) {
    roll = last10Rolls[roll];
    if (roll == 0) {
      $lastRollsDiv.prepend('<span class="rollStat green greenStatImg">' + roll + '</span>');
    } else if (roll <= 7) {
      $lastRollsDiv.prepend('<span class="rollStat red redStatImg">' + roll + '</span>');
    } else if (roll <= 14) {
      $lastRollsDiv.prepend('<span class="rollStat black blackStatImg">' + roll + '</span>');
    }
  }
}
var heighDiv = document.getElementById('redUsersAllBets').offsetHeight;
console.log(heighDiv);
