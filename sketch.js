const JOGAR = 1;
const GAMEOVER = 0;
var estadoJogo = JOGAR;

var somPulo, somMorrendo, somCheckPoint;

var trex,
  trexcorrendo,
  chao,
  chaoinvisivel,
  nuvem,
  cacto,
  escolherCacto,
  tempoJogo,
  trexColidiu,
  fimDeJogo,
  reiniciar;

var imgchao, imgNuvem, imgfimDeJogo, imgReiniciar;
var imgCacto1, imgCacto2, imgCacto3, imgCacto4, imgCacto5, imgCacto6;

function preload() {
  trexcorrendo = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trexColidiu = loadAnimation("trex_collided.png");

  imgchao = loadImage("ground2.png");
  imgNuvem = loadImage("cloud.png");
  imgCacto1 = loadImage("obstacle1.png");
  imgCacto2 = loadImage("obstacle2.png");
  imgCacto3 = loadImage("obstacle3.png");
  imgCacto4 = loadImage("obstacle4.png");
  imgCacto5 = loadImage("obstacle5.png");
  imgCacto6 = loadImage("obstacle6.png");

  imgfimDeJogo = loadImage("gameOver.png");
  imgReiniciar = loadImage("restart.png");

  somPulo = loadSound("jump.mp3");
  somMorrendo = loadSound("die.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(50, 162, 40, 40);
  trex.addAnimation("correndo", trexcorrendo);
  trex.addAnimation("colidiu", trexColidiu);
  trex.scale = 0.5;

  chao = createSprite(200, 180, 500, 10);
  chao.addImage(imgchao);

  chaoinvisivel = createSprite(200, 190, 500, 10);
  chaoinvisivel.visible = false;

  fimDeJogo = createSprite(300, 80, 30, 30);
  fimDeJogo.addImage(imgfimDeJogo);
  fimDeJogo.scale = 0.5;
  reiniciar = createSprite(300, 120, 30, 30);
  reiniciar.addImage(imgReiniciar);
  reiniciar.scale = 0.5;

  tempoJogo = 0;
  grupoNuvens = new Group();
  grupoCactos = new Group();

  trex.setCollider("circle", -10, 10, 35);
  trex.debug = false;
}

function draw() {
  background(180);
  text("Tempo: " + tempoJogo, 500, 40);

  if (estadoJogo == JOGAR) {
    reiniciar.visible = false;
    fimDeJogo.visible = false;
    tempoJogo += 1;
    if (tempoJogo > 0 && tempoJogo % 100 == 0) {
      somCheckPoint.play();
    }

    chao.velocityX = -(8 + tempoJogo / 100);

    if (chao.x < 0) {
      chao.x = chao.width / 2;
    }

    if (keyDown("space") && trex.y > 161) {
      somPulo.play();
      trex.velocityY = -13;
    }
    trex.velocityY = trex.velocityY + 1;
    gerarNuvens();
    gerarCactos();

    if (grupoCactos.isTouching(trex)) {
      somMorrendo.play();

      estadoJogo = GAMEOVER;
    }
  } else if (estadoJogo == GAMEOVER) {
    trex.velocityY = 0;
    reiniciar.visible = true;
    fimDeJogo.visible = true;
    chao.velocityX = 0;
    grupoNuvens.setVelocityXEach(0);
    grupoCactos.setVelocityXEach(0);

    grupoNuvens.setLifetimeEach(-1);
    grupoCactos.setLifetimeEach(-1);

    trex.changeAnimation("colidiu", trexColidiu);
  }

  trex.collide(chaoinvisivel);

  if (mousePressedOver(reiniciar)) {
    restart();
  }

  drawSprites();
}

function restart() {
  estadoJogo = JOGAR;
  grupoCactos.destroyEach();
  grupoNuvens.destroyEach();
  trex.changeAnimation("correndo", trexcorrendo);
  tempoJogo = 0;
}

function gerarNuvens() {
  if (frameCount % 60 == 0) {
    nuvem = createSprite(600, 80, 50, 10);
    nuvem.addImage(imgNuvem);
    nuvem.y = Math.round(random(20, 80));
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nuvem.scale = 0.4;
    nuvem.velocityX = -3;
    nuvem.lifetime = 300;
    grupoNuvens.add(nuvem);
  }
}

function gerarCactos() {
  if (frameCount % 60 == 0) {
    cacto = createSprite(600, 165, 10, 40);

    cacto.velocityX = -(8 + tempoJogo / 100);

    escolherCacto = Math.round(random(1, 6));

    switch (escolherCacto) {
      case 1:
        cacto.addImage(imgCacto1);
        break;
      case 2:
        cacto.addImage(imgCacto2);
        break;
      case 3:
        cacto.addImage(imgCacto3);
        break;
      case 4:
        cacto.addImage(imgCacto4);
        break;
      case 5:
        cacto.addImage(imgCacto5);
        break;
      case 6:
        cacto.addImage(imgCacto6);
        break;
      default:
        break;
    }
    cacto.scale = 0.4;
    cacto.lifetime = 100;
    grupoCactos.add(cacto);
  }
}
