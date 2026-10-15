const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');
const historyList = document.getElementById('history-list');
const restartBtn = document.getElementById('restart-btn');

let secretCode = [];
let attempts = 0;
let isGameOver = false;

// 3桁の重複しないランダムな数字を生成する
function generateSecret() {
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    secretCode = [];
    
    // 最初の数字は0以外にする
    let firstIndex = Math.floor(Math.random() * 9) + 1; // 1〜9
    secretCode.push(numbers[firstIndex]);
    numbers.splice(firstIndex, 1);

    // 残り2桁を選ぶ
    for (let i = 0; i < 2; i++) {
        let index = Math.floor(Math.random() * numbers.length);
        secretCode.push(numbers[index]);
        numbers.splice(index, 1);
    }
    
    console.log("正解の数字 (テスト用):", secretCode.join('')); // デバッグ用
}

// ゲーム初期化
function initGame() {
    generateSecret();
    attempts = 0;
    isGameOver = false;
    historyList.innerHTML = '';
    guessInput.value = '';
    guessInput.disabled = false;
    guessBtn.disabled = false;
    restartBtn.style.display = 'none';
}

// 予測の判定処理
function handleGuess() {
    if (isGameOver) return;

    let guessVal = guessInput.value.trim();

    // 入力チェック（3桁の数字か、重複がないか）
    if (!/^\d{3}$/.test(guessVal)) {
        alert('3桁の半角数字を入力してください！');
        return;
    }

    let guessArr = guessVal.split('').map(Number);
    
    // 重複チェック
    let hasDuplicate = new Set(guessArr).size !== guessArr.length;
    if (hasDuplicate) {
        alert('同じ数字を複数使うことはできません！');
        return;
    }

    attempts++;
    let hits = 0;
    let blows = 0;

    // ヒットとブローの計算
    for (let i = 0; i < 3; i++) {
        if (guessArr[i] === secretCode[i]) {
            hits++;
        } else if (secretCode.includes(guessArr[i])) {
            blows++;
        }
    }

    // 確実に要素を作成して追加
    const item = document.createElement('div');
    item.className = 'history-item';
    
    const numSpan = document.createElement('span');
    numSpan.className = 'history-num';
    numSpan.textContent = `${attempts}回目: ${guessVal}`;

    const resSpan = document.createElement('span');
    resSpan.className = 'history-result';
    resSpan.textContent = `${hits} HIT / ${blows} BLOW`;

    item.appendChild(numSpan);
    item.appendChild(resSpan);
    
    // 履歴リストの一番上に追加
    historyList.insertBefore(item, historyList.firstChild);

    guessInput.value = '';

    // クリア判定
    if (hits === 3) {
        isGameOver = true;
        alert(`🎉 おめでとうございます！ ${attempts}回目で正解しました！`);
        guessInput.disabled = true;
        guessBtn.disabled = true;
        restartBtn.style.display = 'block';
    }
}

guessBtn.addEventListener('click', handleGuess);

guessInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleGuess();
    }
});

restartBtn.addEventListener('click', initGame);

// ゲーム開始
initGame();
