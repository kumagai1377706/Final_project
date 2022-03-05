'use strict'

const charAnimal = ["　", "🐊", "🦝"];
/*
 * オセロオブジェクト
 */
const othelloData = {
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
    //石の数を数えて返す関数
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

    //初めてのナイトメア課題を応用したメソッドを作る
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
    }
};
let numTurn = 0; //番手　先手は白＝1

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
                if (stepCount > 100) {
                    break;
                }
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
            const tempDiv = document.createElement("div");
            const colormap = ["silver", "orchid"];
            const radiusMap = ["10px 20px 10px 20px", "20px 10px 20px 10px"]

            //ボタンの文字を作成
            singleButton.textContent = charAnimal[othelloData.data[x][y]];

            //ボタンスタイルを設定
            singleButton.id = `x${x}y${y}`;
            singleButton.style.left = `${y * 60}px`;
            singleButton.style.backgroundColor = colormap[(x + y) % 2];
            singleButton.style.borderRadius = radiusMap[(x + y) % 2];
            singleButton.style.position = "relarive";
            singleButton.type = 'button';
            singleButton.addEventListener(
                "click",
                function () {
                    putAnimal(this.id);//ボタン押した時のコールバック関数
                }, false);

            tempDiv.append(singleButton)
            objDiV.append(singleButton);

        }

        objDiV.style.position = "absolute";
        objDiV.style.top = `${x * 50}px`;
        objDiV.style.height = "70px";
        objDiV.style.width = "500px";
        objBody.append(objDiV);

    }

    //盤面情報の配置
    document.getElementById("currentTurnAnimal").textContent = charAnimal[numTurn + 1];

}
makeBoard();

//盤面を描画する関数
function boardUpdate() {
    //盤面の更新
    othelloData.data.forEach(
        (elementX, index_X) => {
            elementX.forEach(
                (erementY, index_Y) => {
                    document.getElementById(`x${index_X}y${index_Y}`).textContent
                        = charAnimal[othelloData.data[index_X][index_Y]];
                }
            );
        }
    );

    //currentTurn
    document.getElementById("currentTurnAnimal").textContent = charAnimal[numTurn % 2 + 1];
    document.getElementById("turnCount").textContent = `Turn-${numTurn  + 1}`;


}


//石をおきに行く関数　→ ボタンIDからマス目を取得して置きに行く
function putAnimal(buttonID) {
    buttonID
    const index_X = Number(buttonID[1]);
    const index_Y = Number(buttonID[3]);
    console.log(index_X * 1, index_Y * 1, numTurn % 2 + 1);


    //checkBorad(othelloData.data, 4, 2, 1);

    if (checkBorad(othelloData.data, index_X, index_Y, numTurn % 2 + 1)) {
        numTurn++
    } else{
        alert('そこには置けねぇっす');
    }
    console.log(othelloData.data);
    boardUpdate();
}

// checkBorad;

// checkBorad(othelloData.data, 4, 2, 1);

// // console.log(othelloData.count());
// boardUpdate();

// // //
// // console.log(othelloData);
// checkBorad(othelloData.data, 4, 2, 1);
// console.log(othelloData.data);


// checkBorad(othelloData.data, 5, 1, 2);
// checkBorad(othelloData.data, 1, 4, 1);
// checkBorad(othelloData.data, 1, 3, 1);
// checkBorad(othelloData.data, 4
//     , 5, 2);
// // // othelloData[2][3]=2
// console.log(othelloData.data);