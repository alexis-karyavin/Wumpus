class Wampus {
  constructor(container) {
    this.container = container;
    this.gameField = {};
    this._randomId = [];
    this.positionPlayer = 11;
    this._complete = false;

    //Генерим игровое поле
    this._initFields();
    //Вставляем картинки
    this._initImages();

    console.log(this.gameField)
  }
  _initFields() {
    //Генерируем игровое поле
    for (let i = 5; i >= 1; i--) {
      for (let j = 1; j <= 5; j++) {
        let index = parseInt(i.toString() + j.toString())
        this.container.innerHTML += `<div class="field" data-index="${index}">`;
        this.gameField[index] = 0;
      }
    }
  
    //Генерим id для ям и вампуса
    // let this._randomId = [];
    this._randomId.push(this._generateId());
    this._randomId.push(this._generateId());
    this._randomId.push(this._generateId());

    //Расставляем ямы и вампуса
    this._setDanger(this._randomId);

    // Расставляем ветерки и запахи
    this._setWarning(this._randomId);

    //Вставляем золото
    let positionGold  = this._generateId();
    this.gameField[positionGold] = -1;
  }

  _initImages() {
    //Вставляем вапуса, ямы, ветерки и запахи
    for (let key in this.gameField) {
      let div = document.querySelector(`[data-index="${key}"]`);
      if( this.gameField[key] == 1 || this.gameField[key] == 2) {
        div.innerHTML += `<img src="images/breeze.png">`;
      } else if ( this.gameField[key] == 3 ) {
        div.innerHTML += `<img src="images/stench.png">`;
      } else if ( this.gameField[key] == 4  || this.gameField[key] == 5) {
        div.innerHTML += `<img src="images/breeze-stench.png">`;
      } else if ( this.gameField[key] == 20 || this.gameField[key] == 21 || this.gameField[key] == 23 || this.gameField[key] == 22 || this.gameField[key] == 24 || this.gameField[key] == 25) {
        div.innerHTML += `<img src="images/pit.png">`;
      } else if ( this.gameField[key] == 30 || this.gameField[key] == 31 || this.gameField[key] == 32 || this.gameField[key] == 33 || this.gameField[key] == 34) {
        div.innerHTML += `<img src="images/wumpus.png">`;
      } else if (this.gameField[key] == -1) {
        div.innerHTML += `<img src="images/gold.png">`;
      }
    }
    //Вставляем игрока и золото
    document.querySelector(`[data-index="11"]`).innerHTML = `<img id="player" src="images/player.png">`;
  }

  _generateId() {
    let i = getRandomInt(1,6),
        j = getRandomInt(1,6);
    let id = parseInt(i.toString() + j.toString());

    if(id == 11) {
      id = this._generateId();
    }
    this._randomId.forEach(item=>{
      if(item == id) {
        id = this._generateId();
      }
    })
    return id;
  }

  _setDanger (arr) {
    this.gameField[arr[0]] += 20;
    this.gameField[arr[1]] += 20;
    this.gameField[arr[2]] += 30;
  }

  _setWarning(arr) {
    for (let i = 0; i < arr.length; i++) {
      if( i < arr.length - 1 ) {
        if (this.gameField[arr[i] + 10] != undefined) {
          this.gameField[arr[i] + 10] += 1;
        }  
        if (this.gameField[arr[i] - 10] != undefined) {
          this.gameField[arr[i] - 10] += 1;
        }  
        if (this.gameField[arr[i] + 1] != undefined) {
          this.gameField[arr[i] + 1] += 1;
        }  
        if (this.gameField[arr[i] - 1] != undefined) {
          this.gameField[arr[i] - 1] += 1;
        }  
      } else {
        if (this.gameField[arr[i] + 10] != undefined) {
          this.gameField[arr[i] + 10] += 3;
        }  
        if (this.gameField[arr[i] - 10] != undefined) {
          this.gameField[arr[i] - 10] += 3;
        }  
        if (this.gameField[arr[i] + 1] != undefined) {
          this.gameField[arr[i] + 1] += 3;
        }  
        if (this.gameField[arr[i] - 1] != undefined) {
          this.gameField[arr[i] - 1] += 3;
        }
      }
    }
  }

  _setNextRooms() {
    let arrNextRooms = [];
    if (this.gameField[this.positionPlayer + 10] != undefined) {
      arrNextRooms.push(this.positionPlayer + 10);
    }  
    if (this.gameField[this.positionPlayer - 10] != undefined) {
      arrNextRooms.push(this.positionPlayer - 10);
    }  
    if (this.gameField[this.positionPlayer + 1] != undefined) {
      arrNextRooms.push(this.positionPlayer + 1);
    }  
    if (this.gameField[this.positionPlayer - 1] != undefined) {
      arrNextRooms.push(this.positionPlayer - 1);
    }  
    return arrNextRooms;
  }

  _getNextRoom(arrRooms) {
    let min = this.gameField[arrRooms[0]];
    let nextRoom = arrRooms[0];
    arrRooms.forEach(item => {
      if ( min > this.gameField[item] )  {
        min = this.gameField[item];
        nextRoom = item;
      }
    })
    return nextRoom;
  }

  _goToRoom(index) {
    //Убираем игрока с текущего поля
    // document.querySelector(`[data-index="${this.positionPlayer}"]`).innerHTML = '';
    document.getElementById('player').remove();
    //Вставляем его в следующую комнату
    document.querySelector(`[data-index="${index}"]`).innerHTML += `<img id="player" src="images/player.png">`;
    //Делаем текущую следующую комнату текущей
    this.positionPlayer = index;
    if(this.gameField[index] == -1) {
      document.querySelector('.result').innerHTML = 'Вы выигали';
      document.querySelector('.go').disabled = true;
      document.querySelector('.automatic-movement').disabled = true;
      this._complete = true;
    }
  }

  isComplete() {
    return this._complete;
  }

  go() {
    let nextRooms = this._setNextRooms();
    //Прибибавляем опасность +1 к текущей комнате
    this.gameField[this.positionPlayer] += 1;
    let index = this._getNextRoom(nextRooms);
    
    this._goToRoom(index);
  }

}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
} 


let wampus = new Wampus(document.querySelector('.game-field'));

let buttonNext = document.querySelector('.go');
let buttonReload = document.querySelector('.reload');
let buttonAutomaticMovement = document.querySelector('.automatic-movement');

buttonNext.addEventListener('click', () => {
  wampus.go();
});

buttonReload.addEventListener('click', () => {
  window.location.reload(false); 
})

buttonAutomaticMovement.addEventListener('click', ()=> {
  let interval = setInterval(()=>{
    wampus.go();
    if(wampus.isComplete()) clearInterval(interval);
  },1500);
  buttonNext.disabled = true;
}) 