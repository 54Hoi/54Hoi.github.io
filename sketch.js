class ArrayList extends Array {
    constructor() {
        super();
    }

    size() {
        return this.length;
    }

    add(x) {
        this.push(x);
    }

    get(i) {
        return this[i];
    }

    remove(i) {
        this.splice(i, 1);
    }

    clear() {
        this.length = 0;
    }
}
var bgVideo;
let startButton;
let isGameStarted = false;
let bg;
let playerImage;
let enemyGif;
let gif;
let player;
let enemies;
let score;
let gameOver;
var file;
var slider
var f;
let startTextAlpha = 0; 



function setup() {
    createCanvas(1000, 600);
    bg = loadImage("background.png");
    playerImage = loadImage("player.jpg");
    file = loadSound("bgm.mp3");
    // Ensure file is loaded before playing
    bgVideo = createVideo("menu.mp4");
    bgVideo.size(1000,600);
    bgVideo.volume(1);
    bgVideo.loop();
   // bgVideo.hide();
      
}

function startGame() {
    isGameStarted = true;
    bgVideo.stop(); // 停止播放菜单视频
    bgVideo.remove(); // 移除视频元素
    

    // 初始化游戏状态...
    enemyGif = loadImage("enemy2.GIF");
    slider=createSlider(0,1,0.5,0.01);
    gif =loadImage("result.gif");
    player = createVector(width / 2, height - 50);
    enemies = new ArrayList();
    score = 0;
    gameOver = false;
    file.play();
    file.loop();
}

function draw() {
    if (!isGameStarted) {
        // 主菜单画面
        drawMainMenu();
    } else {
      background(0, 0, 255);
      image(bg, 0, 0, 1000, 600);
      file.setVolume(slider.value());
    if (!gameOver) {
        updatePlayer();
        drawPlayer();
        updateEnemies();
        drawEnemies();
        //textAlign(RIGHT_ARROW);
        textSize(20);
        fill(255);
        text("Score: " + score, width - 100, 30);
    } else {
        textAlign(CENTER, CENTER);
        //textSize(40);
       // fill(255, 0, 0); // text("Game Over", width/2, height/2 - 50);
        textSize(40);
        fill(255);
        text("Score: " + score, width / 2, height / 2 + 20);
        fill(0, 255, 0);
        rect(width / 2 - 100, height / 2 + 80, 200, 50);
        fill(0);
        textSize(20);
        text("Play Again", width / 2, height / 2 + 110);
        image(gif, 410, 100, 184, 194);
    }
  }
    
}
function drawMainMenu() {
    let img=bgVideo.get();
    image(img, 0, 0, width, height);
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(255, startTextAlpha); // 使用alpha值
    text("Press to Start", width / 2, height / 1.1);
    
    // 控制alpha值变化
    startTextAlpha += 5; // 可以调整变化的速度
    
    // 重置alpha值
    if (startTextAlpha > 255) {
        startTextAlpha = 0;
    }
}

function mousePressed() {
    if (!isGameStarted) {
        // 在主菜单点击时触发的操作
        // 您可以在这里处理其他主菜单的点击逻辑
        startGame();
    } else {
      if (gameOver) {
        if (
            mouseX > width / 2 - 100 &&
            mouseX < width / 2 + 100 &&
            mouseY > height / 2 + 80 &&
            mouseY < height / 2 + 130
        ) {
            restartGame();
        }
    } else {
        checkEnemyClick();
    }
  }
}
function updatePlayer() {
    player.x = mouseX;
    player.x = constrain(player.x, 0, width);
}
function drawPlayer() {
    image(playerImage, player.x - 20, player.y - 20, 70, 70);
}
function updateEnemies() {
    if (frameCount % 60 == 0) {
        enemies.add(new Enemy(enemyGif, random(width), 0));
    }
    for (let i = enemies.size() - 1; i >= 0; i--) {
        let enemy = enemies.get(i);
        enemy.update(); // 移除血量為零的敵人
        if (enemy.health <= 0) {
            score += 10;
            enemies.remove(i);
        } // 檢查碰到玩家
        if (enemy.intersects(player)) {
            gameOver = true;
        } // 檢查超過畫面底部
        if (enemy.position.y > height) {
            gameOver = true;
        }
    }
}
function drawEnemies() {
    for (let enemy of enemies) {
        push(); // 儲存當前的變換矩陣
        scale(enemy.size / 400.0); // 根據 size 調整 GIF 的大小
        enemy.draw();
        enemy.drawHealthBar();
        pop(); // 恢復先前的變換矩陣
    }
}
function checkEnemyClick() {
    for (let i = enemies.size() - 1; i >= 0; i--) {
        let enemy = enemies.get(i);
        let hitRadius = enemy.size;
        if (
            dist(mouseX, mouseY, enemy.position.x, enemy.position.y) < hitRadius
        ) {
            enemy.hit();
            enemy.drawHealthBar();
            if (enemy.health <= 0) {
                score += 10;
                enemies.remove(i);
            }
        }
    }
}
function restartGame() {
    player = createVector(width / 2, height - 50);
    enemies.clear();
    score = 0;
    gameOver = false;
}

class Enemy {
    position;
    health;
    size = 200;
    enemyGif;
    constructor(gif, x, y) {
        this.position = new p5.Vector(x, y);
        this.position.y = 100;
        this.health = 30;
        this.enemyGif = gif;
    }
    update() {
        this.position.y += 2;
        this.position.x -= 1;
        this.size += 2; // 每次更新增加大小
    }
    draw() {
        image(this.enemyGif, this.position.x - 20, this.position.y - 20);
    }
    drawHealthBar() {
        let barWidth = 40; // 固定血量條寬度
        let barHeight = 5;
        let barX = this.position.x - barWidth + 20;
        let barY = this.position.y - barHeight - 20; // 繪製血條背景
        fill(255, 0, 0);
        rect(barX, barY, barWidth, barHeight); // 繪製血條
        fill(0, 255, 0);
        let healthWidth = map(this.health, 0, 30, 0, barWidth); // 使用 map() 函數來映射血量
        rect(barX, barY, healthWidth, barHeight);
    }
    hit() {
        this.health -= 10;
        this.health = max(0, this.health);
    }
    intersects(other) {
        let hitRadius = this.size - 50;
        let d = dist(this.position.x, this.position.y, other.x, other.y);
        return d < hitRadius + (100 - this.health) / 2;
    }
}
