'use strict'


/*
 * オセロオブジェクト
 */
const othelloData = {
    charAnimal: ["　", "🐊", "🦝"],
    // 初期盤面データ
    data: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    //石の数を数えて返すメソッド
    count: function () {
        return [
            this.flatten(this.data)
                .filter(element => element === 1)
                .length,
            this.flatten(this.data)
                .filter(element => element === 2)
                .length
        ];
    },

    //初めてのナイトメア課題　を応用したメソッドを作る
    flatten: function (inarray) {
        let returnArray = [];
        let tempArray = [];
        inarray.forEach(
            (element) => {
                if (Array.isArray(element)) {
                    tempArray = this.flatten(element);
                    returnArray = returnArray.concat(tempArray);
                } else {
                    returnArray.push(element);
                }
            }
        );
        return returnArray;
    },

    getWonAnimal: function () {
        const arrTemp = this.count();
        if (arrTemp[0] > arrTemp[1]) {
            return 1;
        } else if (arrTemp[1] > arrTemp[0]) {
            return 2;
        } else {
            return 0;
        }

    },

    //警告メッセージ生成メソッド
    alartMessage: function () {
        this.failCount++;
        return this.failMsgs[this.failCount % (this.failMsgs.length)];
    },
    currentTurn: 0,// 現在ターンのカウンタ
    failCount: 0,//間違った回数のカウンタ
    failMsgs: ["そこには置けないです", "そこには置けねぇっす", "だから置けないんですって", "何度目です？", "You can NOT put an animal here.",
        "Vous ne pouvez pas mettre d'animaux ici"]
};
//let numTurn = 0; //番手　先手は白＝1

/**
 * 
 * @param {*} data  盤面データ　　8ｘ8
 * @param {num} x 座標　0〜7
 * @param {num} y 座標　0〜7
 * @param {num} color  1白　0黒
 * @returns  成功したか（整理するかを）
 */
function checkBorad(data, x, y, color) {
    const reversePos = [[x, y]];//反転する石　すべての座標配列

    // 端っこまでやる　ｘ、ｙを１ずつずらす
    //　隣の石探して行って、同じ色になるまで探す
    //石を変える座標を確定
    //前後左右の方向に行くために-1,0,1 の3**２＝９通りのループを形成
    for (let x_dir = -1; x_dir <= 1; x_dir++) {
        for (let y_dir = -1; y_dir <= 1; y_dir++) {
            let tempPos = []; // 各方向ででのひっくりかえす石を格納する配列
            let stepCount = 1;// 探索ステップカウンタ
            console.log("serch_start", x_dir, y_dir, stepCount);
            // 端っこになるまで探索
            while (x + stepCount * x_dir >= 0 && x + stepCount * x_dir <= 7 && y + stepCount * y_dir >= 0 && y + stepCount * y_dir <= 7) {
                if (data[x + stepCount * x_dir][y + stepCount * y_dir] == color) {
                    // 同じ色を見つけたらひっくりかえすマスの配列にプッシュ
                    //console.log("TEMP",tempPos);//.length);
                    if (tempPos.length > 0) {
                        tempPos.forEach(element =>
                            reversePos.push(element)
                        );
                    }
                    console.log("serch_finish", tempPos);
                    break;
                } else if (data[x + stepCount * x_dir][y + stepCount * y_dir] == 0) {
                    // 同じ色が見つからないまま空きますになったらひっくりかえすます
                    tempPos = [];
                    console.log("serch_break");
                    break;
                } else if ((data[x + stepCount * x_dir][y + stepCount * y_dir] !== color) &&
                    (data[x + stepCount * x_dir][y + stepCount * y_dir] !== 0)) {
                    // 異なる色を発見した場合　ひっくりかえす石を配列に追加
                    tempPos.push([x + stepCount * x_dir, y + stepCount * y_dir]);
                    console.log("find", tempPos);
                    stepCount++;
                }
            }
        }
    }
    //石の色を変える→ ひっくりかえす石があればひっくりかえす
    if (reversePos.length > 1) {
        reversePos.forEach(
            element => {
                data[element[0]][element[1]] = color
            }
        );
        return true;
    } else {
        return false;
    }
}


//ドキュメントにボタンを６４個配置する
function makeBoard() {

    // ボタンの生成
    const objBody = document.getElementsByTagName("body")[0];
    for (let x = 0; x < 8; x++) {
        const tempArray = [];
        const objDiV = document.createElement("div");
        for (let y = 0; y < 8; y++) {

            const singleButton = document.createElement("button");
            // const tempDiv = document.createElement("div");
            const colormap = ["silver", "orchid"];
            const radiusMap = ["10px 20px 10px 20px", "20px 10px 20px 10px"]

            //ボタンの文字を作成
            singleButton.textContent = othelloData.charAnimal[othelloData.data[x][y]];


            singleButton.style.position = "absolute";
            singleButton.style.top = `${x * 50 + 100}px`;

            //ボタンスタイルを設定
            singleButton.id = `x${x}y${y}`;
            singleButton.style.left = `${y * 50}px`;
            singleButton.className = `type${(x + y) % 2}`;
            // singleButton.style.backgroundColor = colormap[(x + y) % 2];
            // singleButton.style.borderRadius = radiusMap[(x + y) % 2];
            singleButton.type = 'button';
            singleButton.addEventListener(
                "click",
                function () {
                    putAnimal(this.id);//ボタン押した時のコールバック関数
                }, false);
            singleButton.addEventListener(
                "mousemove",

                function () {
                    const item = document.getElementById("item")
                    item.style.left = event.clientX + "px";
                    item.style.top = event.clientY + "px";
                }, false);

            //document.getElementsByTagName('body').addEventListener(, mousemove_function);

            // tempDiv.append(singleButton)
            objBody.append(singleButton);

        }

        // objDiV.style.position = "absolute";
        // objDiV.style.top = `${x * 50 + 100}px`;
        // objDiV.style.height = "70px";
        // objDiV.style.width = "500px";
        // objBody.append(objDiV);

    }

    //盤面情報の配置
    document.getElementById("currentTurnAnimal").textContent = othelloData.charAnimal[othelloData.currentTurn + 1];

}

//盤面を描画する関数
function boardUpdate() {
    //盤面の更新
    othelloData.data.forEach(
        (elementX, index_X) => {
            elementX.forEach(
                (erementY, index_Y) => {
                    document.getElementById(`x${index_X}y${index_Y}`).textContent
                        = othelloData.charAnimal[othelloData.data[index_X][index_Y]];
                }
            );
        }
    );

    //currentTurn Info
    document.getElementById("currentTurnAnimal").textContent = othelloData.charAnimal[othelloData.currentTurn % 2 + 1];
    document.getElementById("turnCount").textContent = `Turn-${othelloData.currentTurn + 1}`;

    //UPdate score Info
    othelloData.count().forEach((element, index) => {
        document.getElementById("animalType" + index).textContent = othelloData.charAnimal[index + 1];
        document.getElementById("animalCount" + index).textContent = element
    });
    document.getElementById("item").textContent = othelloData.charAnimal[othelloData.currentTurn % 2 + 1];


}


//石をおきに行く関数　→ ボタンIDからマス目を取得して置きに行く
function putAnimal(buttonID) {
    buttonID
    const index_X = Number(buttonID[1]);
    const index_Y = Number(buttonID[3]);
    //console.log(index_X * 1, index_Y * 1, othelloData.currentTurn % 2 + 1);


    console.log(othelloData.data[index_X][index_Y]);
    //checkBorad(othelloData.data, 4, 2, 1);

    if (othelloData.data[index_X][index_Y] == 0 && checkBorad(othelloData.data, index_X, index_Y, othelloData.currentTurn % 2 + 1)) {
        othelloData.currentTurn++
    } else {

        if (othelloData.failCount == 10) {
            alert("よ〜し、オセロのルール教えちゃうぞ！");
            window.location.href = "https://www.google.com/search?q=%E3%82%AA%E3%82%BB%E3%83%AD%E3%81%AE%E3%83%AB%E3%83%BC%E3%83%AB";
        }
        alert(othelloData.alartMessage());
    }
    console.log(othelloData.data);
    boardUpdate();

    //60て目でゲーム終了
    if (othelloData.currentTurn == 60) {
        finishGame();
    }

}

//ゲームが終わった時のアニメーション処理
function finishGame() {
    const wonAnimal = othelloData.getWonAnimal();
    // 勝った動物のマスをゲットする1
    // 勝った動物が入っているボタンのIDを保存する配列
    const wonAnimalPos = [];
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (othelloData.data[x][y] !== wonAnimal) {
                wonAnimalPos.push([`x${x}y${y}`, (Math.random() + 0.5) * 1.2])
            }
        }
    }

    let finishFlag = false;
    let numTimeCount = 1;

    // 負け組を落下させる処理
    const intervalID = window.setInterval(() => {
        numTimeCount++;
        wonAnimalPos.forEach(element => {
            let strPosY = document.getElementById(element[0]).style.top;//px付きの位置
            let numPosY = Number(strPosY.slice(0, strPosY.length - 2));
            console.log(numPosY);
            numPosY += (numTimeCount ** 3) / 200 * element[1];
            document.getElementById(element[0]).style.top = `${numPosY}px`;
            if (numPosY > screen.height + 1500) {
                console.log("--STOP--");
                window.clearInterval(intervalID);
                if (!finishFlag) { alert("お遊びはここまでだ！仕事に戻れ！") };
                finishFlag = true;
            }
        });
    }, 100);
    // console.log(wonAnimalPos);
}


/*
const panda = {
    x: 100, 
    y: 100,
    x_vec: 10,
    y_vec: 20,
}*/


const pandaArray = [];

function initPanda() {
    const objBody = document.getElementsByTagName("body")[0];
    for (let i = 0; i < Math.random() * 101 + 200; i++) {

        pandaArray.push({
            x: Math.random() + 250,
            y: Math.random() * 10,
            x_vec: Math.random() * 30 - 15,
            y_vec: Math.random() * 20 + 8,
        })
        const divPanda = document.createElement("div");
        divPanda.className = 'panda';
        divPanda.id = `panda${i}`;
        divPanda.style.top = `${pandaArray[i].y}px`;
        divPanda.style.left = `${pandaArray[i].x}px`;
        if (i % 50 === 0) {
            divPanda.textContent = '🐻';
        } else {
            divPanda.textContent = '🐼';
        }

        divPanda.style.zIndex = `${i}`
        objBody.append(divPanda);

    }

}





//　盤面の初期化


const intervalIDPanda = window.setInterval(() => {
    pandaArray.forEach((panda, index) => {
        // console.log(pandaArray.filter(element=> element.y_vec == 0).length);
        // console.log(pandaArray.length);

        if (pandaArray.filter(element => element.y_vec == 0).length == pandaArray.length) {
            window.clearInterval(intervalIDPanda);
            console.log("panda-finish");//alert('init_finish');
        }

        panda.x += panda.x_vec;
        panda.y += panda.y_vec;
        if (panda.y > document.documentElement.clientHeight + 100) {
            panda.y_vec *= -0.8;
            if (panda.y_vec < 0.2) {
                panda.y_vec = 0;
                panda.x_vec = 0;
            }
        } else if (panda.y < 0) {
            panda.y = 0;
            panda.y_vec *= -0.8;
        }
        if (panda.x > document.documentElement.clientWidth) {
            panda.x_vec *= -0.8;
        } else if (panda.x < 0) {
            panda.x = 0;
            panda.x_vec *= -0.8;
        }
        document.getElementById(`panda${index}`).style.top = `${panda.y}px`;
        document.getElementById(`panda${index}`).style.left = `${panda.x}px`;
    });
}, 50);

makeBoard();

//checkBorad(othelloData.data, 4, 2, 1);

boardUpdate();
initPanda();
//finishGame();