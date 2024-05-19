// 初期の体力値を設定します
let player1Health = 100;
let player2Health = 100;

// 体力バーの更新関数
function updateHealthBar(player, health) {
    const healthBar = document.getElementById(`${player}-health`);
    healthBar.style.width = `${health}%`;

    // 体力が50%未満になった場合、色を赤に変更します
    if (health < 50) {
        healthBar.style.backgroundColor = 'red';
    } else {
        healthBar.style.backgroundColor = 'green';
    }
}

// 体力を減らす関数の例
function reduceHealth(player, damage) {
    if (player === 'player1') {
        player1Health = Math.max(player1Health - damage, 0);
        updateHealthBar('player1', player1Health);
    } else if (player === 'player2') {
        player2Health = Math.max(player2Health - damage, 0);
        updateHealthBar('player2', player2Health);
    }
}

// 初期状態の体力バーを設定
updateHealthBar('player1', player1Health);
updateHealthBar('player2', player2Health);

// テスト用に体力を減らす
setTimeout(() => {
    reduceHealth('player1', 30);
}, 1000);

setTimeout(() => {
    reduceHealth('player2', 60);
}, 2000);
