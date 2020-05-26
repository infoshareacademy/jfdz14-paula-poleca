//Modal

const modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".fas.fa-times")
const showGameBtn = document.querySelector("#but")

showGameBtn.addEventListener('click', () => {
    modal.style.display = 'block'
});

modalCloseBtn.addEventListener('click', () => {
    modal.style.display = 'none'

});




(function() {
console.log('mini-game');  

// Botton - show game
const but = document.getElementById('but');
const gameDIV = document.getElementsByClassName('game')[0];

function showGameDiv() {
    console.log('put mail - for game');
    gameDIV.style.transition = "height 3.0s linear 0s";
    gameDIV.style.height = '470px';
}

// button - show gameDIV
but.addEventListener('click', function() {
    showGameDiv();
});

// FORM
// ==================================
var form = document.querySelector('#mail__form');
form.onsubmit = function(e) {
    var email = this.email,
        checkbox = this.checkbox,
        message = document.getElementById('message'),
        msg = "";
    if(email.value === "") {
        msg += "Wypełnij pole email <br/>";
    }
    if(email.value !== "") {
        var reg = /\S+@\S+\.\S+/;
        test = reg.test(email.value);
        if(!test) {
            msg += "Wpisz poprawnie adres email <br/>";
        }
    }
    if(!checkbox.checked) {
        msg += "Zaznacz zgodę warunków bezpieczeństwa"
    }
    if(msg === "") {
        message.classList.remove("messageError");
        message.classList.add("messageSuccess");
        message.innerHTML = "Form sended...";
        showGameDiv();
        // send form - not for real
        // return true;
    } else {
        message.classList.remove("messageSuccess");
        message.classList.add("messageError");
        message.innerHTML = msg;
        // send form stoped
        // return false;  
    }
    e.preventDefault();
};


// MINI-GAME
// ==================================
// Declear
const jumperDiv    = document.getElementById("jumperDiv");
const jumperButton = document.getElementById("jumperButton");
const startButton  = document.getElementById("startButton");
const resetButton  = document.getElementById("resetButton");
let yourScoreView  = document.getElementById("yourScoreFinal");
let yourScore      = document.getElementById("yourScore");
const speedGame = 20;
let lastScore = 0;
let score;
let jumper;
let walls = [];
let boardGame;
let hitBottomStatus = true;

// Jumper's hit - control boolean
function hitBottomFalse() {
    hitBottomStatus = false;
}
function hitBottomTrue() {
    hitBottomStatus = true;
}

// Wall
function Wall(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedUp = 0;
  this.cumulationSpeed = 0;
  this.update = function () {
    let ctx = boardGame.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
}

// Jumper
class Jumper {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speedUp = 0;
    this.cumulationSpeed = 0; 
  }
  update = function () {
    let ctx = boardGame.context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  newPos = function () {
    this.cumulationSpeed += this.speedUp;
    this.y += this.cumulationSpeed;
    this.hitBottom();
    this.hitTop();
  };
  hitTop = function () {
    if (this.y < 0) {
      this.y = 0;
      this.cumulationSpeed = 0;
    }
  };
  hitBottom = function () {
    var jumpBottom = boardGame.canvas.height - this.height;
    if (this.y > jumpBottom) {
      this.y = jumpBottom;
      this.cumulationSpeed = 0;
      if(hitBottomStatus) {
        hitBottomFalse();          
      }
    }
  };
  crash = function (wallObj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = wallObj.x;
    var otherright = wallObj.x + wallObj.width;
    var othertop = wallObj.y;
    var otherbottom = wallObj.y + wallObj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
      ){
        crash = false;
      } else {
      clearInterval(boardGame.interval);
      resetButton.disabled = false;
      jumperButton.disabled = true;
      jumperButton.style.color = '#666';
      if (boardGame.counter > lastScore) {
        lastScore = boardGame.counter;
        yourScoreView.innerText = boardGame.counter;
      }
      return crash;
    }
  };
}

// actual Score
function showActualScore(score) {
  yourScore.textContent = " Actual score: " + score;
}

// update Board Game
function updateBoardGame() {
  var x, height;
  for (i = 0; i < walls.length; i += 1) {
    if (jumper.crash(walls[i])) {
      return;
    }
  }
  boardGame.clear();
  boardGame.counter += 1;
  if (boardGame.counter == 1 || (boardGame.counter / 300) % 1 == 0) {
    x = boardGame.canvas.width;
    height = 200;                                        
    let wall = new Wall(40, 70, "darkgreen", x, height); 
    walls.push(wall);
  }
  for (i = 0; i < walls.length; i += 1) {
    walls[i].x += -1;
    walls[i].update();
  }
  showActualScore(boardGame.counter);
  jumper.newPos();
  jumper.update();
}

// cumulation Speed
function addCumulationSpeed(n) {
  jumper.speedUp = n;
}

// Board Game = 480 x 270
boardGame = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    jumperDiv.appendChild(this.canvas);
    this.counter = 0;
    this.intervalId = null;
  },
  startInterval: function () {
    this.intervalId = setInterval(updateBoardGame, speedGame);
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
};

// for styleJump - bind
function binded() {
  debugger;
  styleJump();
}

// button Jump - style
function styleJump() {
  this.style.color = 'yellow';  
  this.style.fontWeight = 'bold';    
  setTimeout(() => {
    this.style.color = 'white'; 
    this.style.fontWeight = 'normal'; 
  }, 200);
}

// Control game by mouse-button & space
function controlGame() {
  // control Jumper - button
  jumperButton.addEventListener("mouseup", function () {
    addCumulationSpeed(0.15);
    hitBottomTrue();
    const binded = styleJump.bind(this);
    binded();
  });
  jumperButton.addEventListener("mousedown", function () {
    addCumulationSpeed(-1.0);
  });

  // control Jumper - space
  document.onkeyup = function (event) {
    let key_press = String.fromCharCode(event.keyCode);
    if (key_press == " ") {
      addCumulationSpeed(0.20);//0.03
      hitBottomTrue();
      styleJump.call(jumperButton); 
    }
  };
  document.onkeydown = function (event) {
    let key_press = String.fromCharCode(event.keyCode);
    if (key_press == " ") {
      addCumulationSpeed(-1.0); // -0.8

    }
  };
}

// start Board
function startBoard() {
  boardGame.start();
}

// start Game
function startGame() {
  boardGame.startInterval();
  jumper = new Jumper(30, 40, "orange", 20, 100); // width height color left heightDrop
  jumper.speedUp = 0.1;
  score = 0;

  controlGame();
  this.disabled = true;
  jumperButton.disabled = false;
  jumperButton.style.color = '#fff';
}

// reset Game
function resetGame() {
  boardGame.clear();
  clearInterval(boardGame.intervalId);
  boardGame.counter = 0;
  showActualScore(boardGame.counter);
  walls = [];

  startButton.disabled = false;
  this.disabled = true;
}

// load & start game & reset game
document.body.onload = startBoard();
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

})();









