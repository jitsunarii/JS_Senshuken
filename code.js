class InputManager {
  constructor() {
    //方向入力チェック用定数
    this.keyDirections = {
      UP: 1,
      UP_RIGHT: 3,
      RIGHT: 2,
      DOWN_RIGHT: 6,
      DOWN: 4,
      DOWN_LEFT: 12,
      LEFT: 8,
      UP_LEFT: 9,
    };
    //キーの状態管理定数
    this.keyStatus = {
      //押しっぱなし判定の定数
      HOLD: 2,
      //今押した判定の定数
      DOWN: 1,
      //押してない判定の定数
      UNDOWN: 0,
      //今離した判定の定数
      RELEASE: -1,
    };
    //キーの状態管理用変数
    this.input_Player1 = {
      //入力されたキーのチェック用
      keys: {
        Up: false,
        Right: false,
        Down: false,
        Left: false,
        A: false,
        B: false,
        Start: false,
      },
      //一つ前のキーの状態管理用
      keysPrev: {
        Up: false,
        Right: false,
        Down: false,
        Left: false,
        A: false,
        B: false,
      },
    };
     this.input_Player2 = {
      //入力されたキーのチェック用
      keys: {
        Up2: false,
        Right2: false,
        Down2: false,
        Left2: false,
        A2: false,
        B2: false,
      },
      //一つ前のキーの状態管理用
      keysPrev: {
        Up2: false,
        Right2: false,
        Down2: false,
        Left2: false,
        A2: false,
        B2: false,
      },
    };
    //キーを押した時
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      switch(e.key){
        case Config.Keys.Up:
          this.input_Player1.keys.Up = true;
          break;
        case Config.Keys.Down:
          this.input_Player1.keys.Down = true;
          break;
        case Config.Keys.Right:
          this.input_Player1.keys.Right = true;
          break;
        case Config.Keys.Left:
          this.input_Player1.keys.Left = true;
          break;
        case Config.Keys.A:
          this.input_Player1.keys.A = true;
          break;
        case Config.Keys.B:
          this.input_Player1.keys.B = true;
          break;
        case Config.Keys.Start:
          this.input_Player1.keys.Start = true;
          break;
        case Config.Keys.Up2:
          this.input_Player2.keys.Up2 = true;
          break;
        case Config.Keys.Down2:
          this.input_Player2.keys.Down2 = true;
          break;
        case Config.Keys.Right2:
          this.input_Player2.keys.Right2 = true;
          break;
        case Config.Keys.Left2:
          this.input_Player2.keys.Left2 = true;
          break;
        case Config.Keys.A2:
          this.input_Player2.keys.A2 = true;
          break;
        case Config.Keys.B2:
          this.input_Player2.keys.B2 = true;
          break;
      }
    });

    //キーを離したとき

    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      switch(e.key){
        case Config.Keys.Up:
          this.input_Player1.keys.Up = false;
          break;
        case Config.Keys.Down:
          this.input_Player1.keys.Down = false;
          break;
        case Config.Keys.Right:
          this.input_Player1.keys.Right = false;
          break;
        case Config.Keys.Left:
          this.input_Player1.keys.Left = false;
          break;
        case Config.Keys.A:
          this.input_Player1.keys.A = false;
          break;
        case Config.Keys.B:
          this.input_Player1.keys.B = false;
          break;
        case Config.Keys.Start:
          this.input_Player1.keys.Start = false;
          break;
        case Config.Keys.Up2:
          this.input_Player2.keys.Up2 = false;
          break;
        case Config.Keys.Down2:
          this.input_Player2.keys.Down2 = false;
          break;
        case Config.Keys.Right2:
          this.input_Player2.keys.Right2 = false;
          break;
        case Config.Keys.Left2:
          this.input_Player2.keys.Left2 = false;
          break;
        case Config.Keys.A2:
          this.input_Player2.keys.A2 = false;
          break;
        case Config.Keys.B2:
          this.input_Player2.keys.B2 = false;
          break;
      }
    });
  }

  //方向キー入力チェック
  checkDirection(player) {
    let direction = 0;//初期化
    const input = player === 1 ? this.input_Player1.keys : this.input_Player2.keys;
    if(input.Up||input.Up2){
        direction += this.keyDirections.UP;
    }
    if(input.Right||input.Right2){
      direction += this.keyDirections.RIGHT;
    }
    if(input.Down||input.Down2){
      direction += this.keyDirections.DOWN;
    }
    if(input.Left||input.Left2){
      direction += this.keyDirections.LEFT;
    }
    return direction;
  }

  //ボタンの入力状態をチェックして返す
  checkButton(player, key) {
    const input = player === 1 ? this.input_Player1.keys : this.input_Player2.keys;
    const inputPrev = player === 1 ? this.input_Player1.keysPrev : this.input_Player2.keysPrev;

    if(input[key]) {
      if(!inputPrev[key]) {
        inputPrev[key] = true;
        return this.keyStatus.DOWN;
      }
      return this.keyStatus.HOLD;
    } else {
      if(inputPrev[key]) {
        inputPrev[key] = false;
        return this.keyStatus.RELEASE;
      }
      return this.keyStatus.UNDOWN;
    }
  }
}