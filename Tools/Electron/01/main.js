const {app, BrowserWindow} = require('electron');

let win;
function createWindow () {
    // 创建浏览器窗口
    win = new BrowserWindow({
        width: 800, 
        height: 600,
        frame: false,  //创建无边框窗体
        // titleBarStyle: 'hidden'
        transparent: true,
        backgroundColor: '#2eff29' ,    // 建议使用设置 backgroundColor 使应用程序感觉更原生
        opacity: 0.8
    });
    // 然后加载应用的index.html
    win.loadFile('index.html');
    // 打开开发者工具
    win.webContents.openDevTools();

    // 当window被关闭， 这个事件会被触发。
    win.on('closed', () => {
        // 取消引用window对象， 如果你的应用支持多个窗口的话，
        // 通常将多个window对象保存在一个数组中,
        // 同时， 应该删除响应的元素。
        win = null;
    });
    
    // 在加载页面时，渲染进程第一次完成绘制时，会发出 ready-to-show 事件  在此事件后显示窗口将没有视觉闪烁：
    win.once('ready-to-show', () => {
        win.show();
        child.show();
    });

    let child = new BrowserWindow({
        parent: win,
      backgroundColor: '#4433cd',
      height: 600,
      width: 600,
      opacity: 0.8
    })
  
  
}

app.on('ready', createWindow);
// 当全部窗口关闭时退出
app.on('window-all-closed', ()=> {
    if (process.platform !=='darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    // 通常在应用程序上重新创建一个窗口
    if (win === null ) {
        createWindow();
    }
})