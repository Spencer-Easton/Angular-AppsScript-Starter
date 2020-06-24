// @OnlyCurrentDoc

function doGet(e) {
    return HtmlService.createHtmlOutputFromFile('client/index.html')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
}


function onOpen(e) {
    SpreadsheetApp.getUi().createAddonMenu()
        .addItem('Start', 'showSidebar')
        .addToUi();
}

function onInstall(e) {
    onOpen(e);
}

function showSidebar() {
    const ui = HtmlService.createHtmlOutputFromFile('client/index.html')
        .setTitle('Its a Sidebar!');
    SpreadsheetApp.getUi().showSidebar(ui);
}


function showDialog(route) {
    let ui = HtmlService.createTemplateFromFile('client/index.html');
    ui.route = route || 'home';
    ui = ui.evaluate().setWidth(800).setHeight(600);
    SpreadsheetApp.getUi().showModalDialog( ui, 'DialogBox')
}
