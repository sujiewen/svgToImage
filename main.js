const sharp = require('sharp')
let { DOMImplementation, XMLSerializer } = require('xmldom');
let JsBarcode = require('jsbarcode');
let readline = require('readline');
const buildOptions = require('minimist-options');

let  rl = readline.createInterface(process.stdin, process.stdout);

function autoBarCodeToFile(content, localPath, width = '1.5px', height = '70px') {
    return new Promise((resolve, reject) => {
        try {
            let flag = false
            let xmlSerializer = new XMLSerializer();
            //http://www.w3.org/1999/xhtml
            let document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            //http://www.w3.org/2000/svg
            let svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            try {
                /*
                *        format: "CODE39",//选择要使用的条形码类型
                         width:3,//设置条之间的宽度
                         height:100,//高度
                         *  text:"456",//覆盖显示的文本
                         displayValue:true,//是否在条形码下方显示文字
                         fontOptions:"bold italic",//使文字加粗体或变斜体
                         font:"fantasy",//设置文本的字体
                         textAlign:"left",//设置文本的水平对齐方式
                         textPosition:"top",//设置文本的垂直位置
                         textMargin:5,//设置条形码和文本之间的间距
                         fontSize:15,//设置文本的大小
                         background:"#eee",//设置条形码的背景
                         lineColor:"#2196f3",//设置条和文本的颜色。
                         margin:15//设置条形码周围的空白边距
                *
                * */
                JsBarcode(svgNode, String(content), {
                    xmlDocument: document,
                    displayValue: true, // 是否默认显示条形码数据
                    textPosition: 'bottom', // 条形码数据显示的位置
                    background: '#fff', // 条形码背景颜色
                    width: width,
                    height: height,
                    fontSize: 12,
                    margin:10
                });
                let svgText = xmlSerializer.serializeToString(svgNode);
                const roundedCorners1 = Buffer.from(
                    svgText
                );

                sharp(roundedCorners1).png().toFile(localPath, (err, info) => {
                    if (!err) {
                        resolve()
                    } else {
                        reject(err)
                    }
                });
            } catch (e) {
                reject(e)
            }
        } catch (e2) {
            reject(e2)
        }
    })
}

// const options = buildOptions({
//     name: {
//         type: 'string',
//         alias: 'n',
//         default: 'john'
//     },
//
//     force: {
//         type: 'boolean',
//         alias: ['f', 'o'],
//         default: false
//     },
//
//     score: {
//         type: 'number',
//         alias: 's',
//         default: 0
//     },
//
//     arr: {
//         type: 'array',
//         alias: 'a',
//         default: []
//     },
//
//     strings: {
//         type: 'string-array',
//         alias: 's',
//         default: ['a', 'b']
//     },
//
//     booleans: {
//         type: 'boolean-array',
//         alias: 'b',
//         default: [true, false]
//     },
//
//     numbers: {
//         type: 'number-array',
//         alias: 'n',
//         default: [0, 1]
//     },
//
//     published: 'boolean',
//
//     // Special option for positional arguments (`_` in minimist)
//     arguments: 'string'
// });


const  opts = buildOptions( {
    content: 'string',
    path: 'string'})

const args = require('minimist')(process.argv.slice(2), opts)

try {
    let localPath = args['path'] ? args['path']: (process.cwd() + '/dist/test.png')
    autoBarCodeToFile(args['content'] + '', localPath).then(res => {
        console.log('path=' + localPath)
        rl.close()
    }).catch(err => {
        console.log(err)
        rl.close()
    })
} catch (e) {
    console.log(e)
    rl.close()
}


/*
*  方法setPromat(promat)，就是给每一行设置一个提示符，就好比window命令行的> ，我们这里设置的是Test>
*  promat()可以算是最重要的方法了，因为它才体现了Readline的核心作用，以行为单位读取数据，premat方法就是在等待用户输入数据
*  这里又监听了’line’ 事件，因为promat方法调用一次就只会读取一次数据，所以，在这个方法又调用了一次promat方法，这样就可以继续读取用户输入，从而达到一种命令行的效果
*/


rl.on('line', function(line) {
    switch(line.trim()) {
        case 'close':
            rl.close();
            break;
        default:
            break;
    }
    rl.prompt();
});

rl.on('close', function() {
    process.exit(0);
});