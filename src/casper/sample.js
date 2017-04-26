var casper = require('casper').create();
casper.start('http://casperjs.org/');

casper.then(function() {
    this.echo('First Page: ' + this.getTitle());
});

casper.thenOpen('http://phantomjs.org', function() {
    this.echo('Second Page: ' + this.getTitle());
});

casper.thenOpen('file:///Users/sskilinskas/PhpstormProjects/sandbox/index.html', function() {
    this.echo('Third Page: ' + this.getTitle());
});

casper.thenOpen('https://www.moebel.de/', function() {
    this.echo('Fourth Page: ' + this.getTitle());
});

casper.run();
