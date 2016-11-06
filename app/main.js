angular
    .module('Main', [])
    .controller('MainController', function($scope, Game) {

        Game.start()

        $scope.selectGem = Game.selectGem

        $scope.board = Game.board
        $scope.data = Game.data

    });
