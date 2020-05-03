var RadicalFreedom = artifacts.require("./RadicalFreedom.sol");
var crypto = require("crypto");
var articles = ["myArticle.mySite.com/Articles",
            "https://www.freepress.association.com/2019/January/First-Report-of-COVID19",
            "shortArticleLink.com",
            "Article4", "Article5", "Article6", "Article7", "Article8"];


contract("RadicalFreedom", function(accounts) {
    var radicalFreedomInstance;
    it("initializes with the correct numberOfArticles", function() {
        return RadicalFreedom.deployed().then(function(instance) {
            return instance.getNumberOfArticles();
        }).then(function(numberOfArticles) {
            assert.equal(numberOfArticles, 0);
        });
    });

    it("it adds the correct mappings", function () {
        return RadicalFreedom.deployed().then(function (instance) {
            radicalFreedomInstance = instance;
            articles.forEach(function publishArticles(article) {
                radicalFreedomInstance.pushArticle(article, '0x' + crypto.createHash('sha256').update(article).digest('hex'));
            });
        }).then(function () {
            articles.forEach(function checkArticles(article, currentIndex) {
                return radicalFreedomInstance.getHash(currentIndex).then(function(hash) {
                    assert.equal(radicalFreedomInstance.getArticle(hash), article, `Article${currentIndex} matches!`);
                });

            });
        })
    })
});