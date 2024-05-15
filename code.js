/********************************
これはInputManagerだけです。
使用してるサンプルはこっち
https://codepen.io/inwan78/pen/yLjoqyg
*********************************/
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
      HOLD: 2,
      DOWN: 1,
      UNDOWN: 0,
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
        Start: false
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

    //スマホ・タブレットの時だけv-pad表示
    if(navigator.userAgent.match(/iPhone|iPad|Android/)){
      this.vpad = new Vpad(this.input);
    }

    //ゲームパッド
    this.gamePad = new GamePad(this.input);
    //ゲームパッド接続時のイベント
    addEventListener("gamepadconnected", (e) => {
      this.gamePad.connected();
      //バーチャルパッドがあったら(モバイルなら)非表示
      if(this.vpad){
        this.vpad.pad.style.display = "none";
      }
    });
    //ゲームパッド切断時のイベント
    addEventListener("gamepaddisconnected", (e) => {
      this.gamePad.disconnected();
      //バーチャルパッドがあったら(モバイルなら)表示
      if(this.vpad){
        this.vpad.pad.style.display = "block";
      }
    }); 

    //キーを押した時
    document.addEventListener('keydown', (e) => {
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

/******************************************************
 * バーチャルパッド
 ******************************************************/
class Vpad {
  constructor(input){
    this.input = input;//InputManagerのinput
    this.resizePad();
    // リサイズイベントの登録
    window.addEventListener('resize', ()=>{this.resizePad();});
  }
  //画面サイズが変わるたびにvpadも作り変える
  resizePad(){
    let styleDisplay = "block";//ゲームパッド対策
    //すでにあれば一度削除する
    if(this.pad != undefined){
      styleDisplay = this.pad.style.display;//ゲームパッド対策
      while(this.pad.firstChild){
        this.pad.removeChild(this.pad.firstChild);
      }
      this.pad.parentNode.removeChild(this.pad);
    }

    const screen = document.getElementById("game-screen");//ゲーム画面

    //HTMLのdivでvpad作成
    const pad = document.createElement('div');
    document.body.appendChild(pad);
    this.pad = pad;
    pad.id = "pad";
    pad.style.width = screen.style.width;
    pad.style.display = styleDisplay;
    
    //タッチで拡大とか起こるのを防ぐ
    pad.addEventListener("touchstart", (e) => {
      e.preventDefault();
    });
    pad.addEventListener("touchmove", (e) => {
      e.preventDefault();
    });

    //横長の場合位置変更
    if(window.innerWidth > window.innerHeight){
      pad.style.width = `${window.innerWidth}px`;
      pad.style.position = "absolute";//画面の上にかぶせるため
      pad.style.backgroundColor = "transparent";//透明
      pad.style.bottom = "0";//下に固定
    }
    const height = Number(screen.style.height.split('px')[0]) * 0.5;//ゲーム画面の半分の高さをゲームパッドの高さに
    pad.style.height = `${height}px`;
    
    //方向キー作成
    if(Config.vpadType){
      new Config.vpadType(this.pad, this.input, height);
    }else{
      new DirKey4way(this.pad, this.input, height);
    }
    
    //Aボタン作成
    let style = {
      width: `${height * 0.5}px`,
      height: `${height * 0.5}px`,
      right: `${height * 0.5}px`,
      top: `${height * 0.4}px`,
      borderRadius: "50%"
    }
    new ActBtn(this.pad, this.input, "A", "A", style);

    //Bボタン作成
    style = {
      width: `${height * 0.5}px`,
      height: `${height * 0.5}px`,
      right: `${height * 0.05}px`,
      top: `${height * 0.1}px`,
      borderRadius: "50%"
    }
    new ActBtn(this.pad, this.input, "B", "B", style);

    //STARTボタン作成
    style = {
      width: `${height * 0.3}px`,
      height: `${height * 0.15}px`,
      right: `${height * 0.65}px`,
      top: `${height * 0.05}px`,
      borderRadius: `${height * 0.15 * 0.5}px`
    }
    new ActBtn(this.pad, this.input, "Start", "START", style);
  }
}
//十字ボタン作成
function creatCrossButton(parent, padHeight){
  //HTMLのdivでキーのエリアを作成
  const div = document.createElement('div');
  parent.appendChild(div);
  div.className = "dir-key";
  div.style.width = div.style.height = `${padHeight * 0.8}px`;
  div.style.left = `${padHeight * 0.05}px`;
  div.style.top = `${padHeight * 0.1}px`;

  //十字キーのボタン(張りぼて。タッチイベントはない)
  const up = document.createElement('div');
  up.className = "dir up";
  div.appendChild(up);
  const left = document.createElement('div');
  left.className = "dir left";
  div.appendChild(left);
  const right = document.createElement('div');
  right.className = "dir right";
  div.appendChild(right);
  const down = document.createElement('div');
  down.className = "dir down";
  div.appendChild(down);
  const mid = document.createElement('div');
  mid.className = "dir mid";
  div.appendChild(mid);
  const circle = document.createElement('div');
  circle.className = "circle";
  mid.appendChild(circle);

  return div;
}

class DirKey4way {
  constructor(parent, input, padHeight) {
    this.isTouching = false;
    
    this.maxRadius = padHeight * 0.15;//中心移動させる半径
    this.emptySpace = padHeight * 0.05;//あそび

    const div = creatCrossButton(parent, padHeight);
    
    const pos = div.getBoundingClientRect();//位置を取得している
    this.originX = padHeight*0.8*0.5 + pos.left;
    this.originY = padHeight*0.8*0.5 + pos.top;

    //タッチイベント
    div.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.isTouching = true;    
      dirSet(e);  
    });

    div.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if(!this.isTouching) return;
      dirReset();//からなず一度リセット
      dirSet(e);
    });
    
    div.addEventListener("touchend", (e) => {
      dirReset();
      this.isTouching = false;
    });

    const dirSet = (e) => {
      let y = e.targetTouches[0].clientY - this.originY;
      let x = e.targetTouches[0].clientX - this.originX;

      const abs_x = Math.abs(x);
      const abs_y = Math.abs(y);
      if(abs_x > abs_y){//xの方が大きい場合左右移動となる
        if(x < 0){//マイナスであれば左
          input.keys.Left = true;
        }else{
          input.keys.Right = true;
        }
      }else{//yの方が大きい場合上下移動となる
        if(y < 0){//マイナスであれば上
          input.keys.Up = true;
        }else{
          input.keys.Down = true;
        }
      }    
    }
    const dirReset = () => {
      input.keys.Right = input.keys.Left = input.keys.Up = input.keys.Down = false;
    }
  }
}
//方向キークラス8方向
class DirKey8way {
  constructor(parent, input, padHeight) {
    this.isTouching = false;
    this.originX = 0;
    this.originY = 0;
    this.maxRadius = padHeight * 0.15;//中心移動させる半径
    this.emptySpace = padHeight * 0.05;//あそび

    const div = creatCrossButton(parent, padHeight);
    
    //タッチイベント
    div.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.isTouching = true;    
      //タッチした位置を原点にする
      this.originX = e.targetTouches[0].clientX;
      this.originY = e.targetTouches[0].clientY;
    });

    div.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if(!this.isTouching) return;
      dirReset();//からなず一度リセット
      
      //タッチ位置を取得
      const posX = e.targetTouches[0].clientX;
      const posY = e.targetTouches[0].clientY;

      //原点からの移動量を計算
      let vecY = posY - this.originY;
      let vecX = posX - this.originX;
      let vec = Math.sqrt(vecX * vecX + vecY * vecY);
      if(vec < this.emptySpace)return;//移動が少ない時は反応しない(遊び)

      const rad = Math.atan2(posY - this.originY, posX - this.originX);
      const y = Math.sin(rad);
      const x = Math.cos(rad);

      //移動幅が大きいときは中心を移動させる
      if(vec > this.maxRadius){
        this.originX = posX - x * this.maxRadius;
        this.originY = posY - y * this.maxRadius;
      }
     
      const abs_x = Math.abs(x);
      const abs_y = Math.abs(y);
      if(abs_x > abs_y){//xの方が大きい場合左右移動となる
        if(x < 0){//マイナスであれば左
          input.keys.Left = true;
        }else{
          input.keys.Right = true;
        }
        if(abs_x <= abs_y * 2){//2yがxより大きい場合斜め入力と判断
          if(y < 0){//マイナスであれば上
            input.keys.Up = true;
          }else{
            input.keys.Down = true;
          }
        }
      }else{//yの方が大きい場合上下移動となる
        if(y < 0){//マイナスであれば上
          input.keys.Up = true;
        }else{
          input.keys.Down = true;
        }
        if(abs_y <= abs_x * 2){//2xがyより大きい場合斜め入力と判断
          if(x < 0){//マイナスであれば左
            input.keys.Left = true;
          }else{
            input.keys.Right = true;
          }
        }
      }    
    });
    
    div.addEventListener("touchend", (e) => {
      dirReset();
      this.isTouching = false;
    });

    const dirReset = () => {
      input.keys.Right = input.keys.Left = input.keys.Up = input.keys.Down = false;
    }
  }
}
//アクションボタンクラス
class ActBtn {
  constructor(parent, input, key, name, style) {
    //HTMLのdivでボタンを作成
    const div = document.createElement('div');
    div.className = "button";
    parent.appendChild(div);
    div.style.width = style.width;
    div.style.height = style.height;
    div.style.right = style.right;
    div.style.top = style.top;
    div.style.borderRadius = style.borderRadius;

    //ボタン名を表示
    const p = document.createElement('p');
    p.innerHTML = name;
    div.appendChild(p);

    //タッチスタート
    div.addEventListener("touchstart", (e) => {
      e.preventDefault();
      input.keys[key] = true;
    });
    
    //タッチエンド
    div.addEventListener("touchend", (e) => {
      input.keys[key] = false;
    });
  }
}

//ゲームパッドクラス
class GamePad {
  constructor(input){
    this.input = input;
    this.isConnected = false;
    this.isStickUsing = false;
  }
  connected(){
    this.isConnected = true;
  }
  disconnected(){
    this.isConnected = false;
  }
  update(){
    if(!this.isConnected) return;    
    const input = this.input;
    const pads = navigator.getGamepads();

    const sticks = pads[0].axes;
    //X軸
    if(sticks[0] > 0.5){
      input.keys.Right = true;
      this.isStickUsing = true;
    }else if(this.isStickUsing){
      input.keys.Right = false;
    }
    if(sticks[0] < -0.5){
      input.keys.Left = true;
      this.isStickUsing = true;
    }else if(this.isStickUsing){
      input.keys.Left = false;
    }
    //Y軸
    if(sticks[1] > 0.5){
      input.keys.Down = true;
      this.isStickUsing = true;
    }else if(this.isStickUsing){
      input.keys.Down = false;
    }
    if(sticks[1] < -0.5){
      input.keys.Up = true;
      this.isStickUsing = true;
    }else if(this.isStickUsing){
      input.keys.Up = false;
    }

    const buttons = pads[0].buttons;
    //上
    if(buttons[12].pressed){
      input.keys.Up = true;
      this.isStickUsing = false;
    }else if(!this.isStickUsing){
      input.keys.Up = false;
    }
    //下
    if(buttons[13].pressed){
      input.keys.Down = true;
      this.isStickUsing = false;
    }else if(!this.isStickUsing){
      input.keys.Down = false;
    }
    //左
    if(buttons[14].pressed){
      input.keys.Left = true;
      this.isStickUsing = false;
    }else if(!this.isStickUsing){
      input.keys.Left = false;
    }
    //右
    if(buttons[15].pressed){
      input.keys.Right = true;
      this.isStickUsing = false;
    }else if(!this.isStickUsing){
      input.keys.Right = false;
    }
    //スタート
    if(buttons[9].pressed){
      input.keys.Start = true;
    }else{
      input.keys.Start = false;
    }
    //A
    if(buttons[0].pressed){
      input.keys.A = true;
    }else{
      input.keys.A = false;
    }
    //B
    if(buttons[1].pressed){
      input.keys.B = true;
    }else{
      input.keys.B = false;
    }
  }
}