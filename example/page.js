document.querySelector('mkt-prompt').addEventListener('mkt-prompt-submit', function(data) {
    console.log(data.detail.snowman);
});
document.querySelector('mkt-prompt form').addEventListener('submit', function() {
    console.log(this.querySelector('textarea').value);
});
