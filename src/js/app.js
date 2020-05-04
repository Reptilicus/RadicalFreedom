App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    document.getElementById('publishArticle').onsubmit = App.publishArticle;
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("RadicalFreedom.json", function(radicalFreedom) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.RadicalFreedom = TruffleContract(radicalFreedom);
      // Connect provider to interact with contract
      App.contracts.RadicalFreedom.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var radicalFreedomInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.RadicalFreedom.deployed().then(function(instance) {
      radicalFreedomInstance = instance;
      radicalFreedomInstance.getNumberOfArticles().then(function(numberOfArticles) {
        var publishedArticles = $("#publishedArticles");
        publishedArticles.empty();

        for (var i = Math.max(numberOfArticles - 10, 0); i <= numberOfArticles; i++) {
          radicalFreedomInstance.getHash(i).then(function(hash) {
            radicalFreedomInstance.getArticle(hash).then(function(article) {
              var articleAddress = article;
              var articleHash = hash;
              var articleTemplate = "<tr><th>" + articleAddress + "</th><td>" + articleHash + "</td></tr>"
              publishedArticles.append(articleTemplate);
            });
          });
        }

        loader.hide();
        content.show();
      }).catch(function(error) {
        console.warn(error);
      });
    });
  },

  publishArticle: function() {
    alert("publishing!");
    try {
      alert(CryptoJS.SHA256("hello").toString(CryptoJS.enc.Hex));
    } catch (err) {
      alert(err);
    }
    var article = $('#articleLink').val();
    App.contracts.RadicalFreedom.deployed().then(function(instance) {
      return instance.pushArticle(article, '0x' + CryptoJS.SHA256(article).toString(CryptoJS.enc.Hex));
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
