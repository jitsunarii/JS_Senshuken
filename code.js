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
    this.input = {
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
        Start: false
      },
    };
    //キーを押した時
    document.addEventListener('keydown', (e) => {
      console.log(e.key);
      e.preventDefault();
      switch(e.key){
        case Config.Keys.Up:
          this.input.keys.Up = true;
          break;
        case Config.Keys.Down:
          this.input.keys.Down = true;
          break;
        case Config.Keys.Right:
          this.input.keys.Right = true;
          break;
        case Config.Keys.Left:
          this.input.keys.Left = true;
          break;
        case Config.Keys.A:
          this.input.keys.A = true;
          break;
        case Config.Keys.B:
          this.input.keys.B = true;
          break;
        case Config.Keys.Start:
          this.input.keys.Start = true;
          break;
      }
    });

    //キーを離したとき
    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      switch(e.key){
        case Config.Keys.Up:
          this.input.keys.Up = false;
          break;
        case Config.Keys.Down:
          this.input.keys.Down = false;
          break;
        case Config.Keys.Right:
          this.input.keys.Right = false;
          break;
        case Config.Keys.Left:
          this.input.keys.Left = false;
          break;
        case Config.Keys.A:
          this.input.keys.A = false;
          break;
        case Config.Keys.B:
          this.input.keys.B = false;
          break;
        case Config.Keys.Start:
          this.input.keys.Start = false;
          break;
      }
    });
  }

  //方向キー入力チェック
  checkDirection() {
    let direction = 0;//初期化
    if(this.input.keys.Up){
        direction += this.keyDirections.UP;
    }
    if(this.input.keys.Right){
      direction += this.keyDirections.RIGHT;
    }
    if(this.input.keys.Down){
      direction += this.keyDirections.DOWN;
    }
    if(this.input.keys.Left){
      direction += this.keyDirections.LEFT;
    }
    return direction;
  }

  //ボタンの入力状態をチェックして返す
  checkButton(key) {
    if(this.input.keys[key]){
      if(this.input.keysPrev[key] == false){
        this.input.keysPrev[key] = true;
        return this.keyStatus.DOWN;//押されたとき
      }
      return this.keyStatus.HOLD;//押しっぱなし
    }else{
      if(this.input.keysPrev[key] == true){
        this.input.keysPrev[key] = false;
        return this.keyStatus.RELEASE;//ボタンを離した時
      }
      return this.keyStatus.UNDOWN;//押されていない
    }
  }
}