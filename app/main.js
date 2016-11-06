angular
    .module('Main', [])
    .controller('MainController', function($scope, Game) {

        Game.start()
        
        $scope.selectGem = Game.selectGem

        $scope.board = Game.board
        $scope.data = Game.data

        // var availableColors = [
        //     'green',
        //     'blue',
        //     'red',
        //     'orange'
        // ]

        // var createRow = function(cellsNumber) {
        //     return function(row) {
        //         return _.times(cellsNumber, createGem(row))
        //     }
        // }

        // var createGem = function(row) {
        //     return function(col) {
        //         return {
        //             color: _.sample(availableColors),
        //             selected: false,
        //             row: row,
        //             col: col
        //         }
        //     }
        // }

        // $scope.board = _.times(ROWS_NUMBER, createRow(ROWS_NUMBER))

        // var createGem = function(row, col, colors) {
        //     return {
        //         row: row,
        //         col: col,
        //         color: _.sample(colors),
        //         selected: false
        //     }
        // }

        // var fillBoard = function(board, row, col, previousColor) {
        //     if (board[row][col]) {
        //         return
        //     }

        //     var colorOptions = _.without(availableColors, previousColor)
        //     var gem = createGem(row, col, colorOptions)
        //     if (checkGemMatches(gem).length > 0) {
        //         // Picked color had matches, replace it
        //         colorOptions = _.without(colorOptions, gem.color)
        //         gem = createGem(row, col, colorOptions)
        //     }

        //     board[row][col] = gem
        //     if (row < board.length - 1) {
        //         fillBoard(board, row+1, col, gem.color)
        //     }
        //     if (col < board[row].length - 1) {
        //         fillBoard(board, row, col+1, gem.color)
        //     }

        // }

        // $scope.prevGem = null

        // $scope.selectGem = function(gem) {
        //     if (gem.selected) {
        //         gem.selected = false
        //         $scope.prevGem = null
        //     }
        //     else if ($scope.prevGem) {
        //         var prevRow = $scope.prevGem.row
        //         var prevCol = $scope.prevGem.col
        //         $scope.board[prevRow][prevCol] = gem
        //         $scope.board[gem.row][gem.col] = $scope.prevGem
        //         $scope.prevGem.row = gem.row
        //         $scope.prevGem.col = gem.col
        //         gem.row = prevRow
        //         gem.col = prevCol
        //         $scope.prevGem.selected = false
        //         $scope.prevGem = null
        //         checkMatches()
        //     }
        //     else {
        //         gem.selected = true
        //         $scope.prevGem = gem
        //     }
        // }

        // var checkMatches = function() {
        //     var gem, gemsToDestroy, columns;
        //     for (var i = 0; i < $scope.board.length; i++) {
        //         for (var j = 0; j < $scope.board[i].length; j++) {
        //             gem = $scope.board[i][j]
        //             gemsToDestroy = checkGemMatches(gem, 5)
        //             if (gemsToDestroy.length > 0) {
        //                 columns = _.uniq(_.map(gemsToDestroy, 'col'))
        //                 _.map(gemsToDestroy, destroyGem)
        //                 _.map(columns, refillColumn)
        //                 i = -1
        //                 j = -1
        //                 break
        //             }
        //         }
        //     }
        // }

        // var checkGemMatches = function(gem) {
        //     // Return an array of gems to destroy

        //     var goUp = function(gem) {
        //         return $scope.board[gem.row-1] && $scope.board[gem.row-1][gem.col]
        //     }
        //     var goDown = function(gem) {
        //         return $scope.board[gem.row+1] && $scope.board[gem.row+1][gem.col]
        //     }
        //     var goLeft = function(gem) {
        //         return $scope.board[gem.row][gem.col-1]
        //     }
        //     var goRight = function(gem) {
        //         return $scope.board[gem.row][gem.col+1]
        //     }

        //     var gemsToDestroy = []

        //     var verticalGemsToDestroy = []
        //     recursiveCheckGemMatches(gem, verticalGemsToDestroy, goUp)
        //     recursiveCheckGemMatches(gem, verticalGemsToDestroy, goDown)

        //     if (verticalGemsToDestroy.length >= 2) {
        //         gemsToDestroy = gemsToDestroy.concat(verticalGemsToDestroy)
        //     }

        //     var horizontalGemsToDestroy = []
        //     recursiveCheckGemMatches(gem, horizontalGemsToDestroy, goLeft)
        //     recursiveCheckGemMatches(gem, horizontalGemsToDestroy, goRight)

        //     if (horizontalGemsToDestroy.length >= 2) {
        //         gemsToDestroy = gemsToDestroy.concat(horizontalGemsToDestroy)
        //     }

        //     if (gemsToDestroy.length > 0) {
        //         gemsToDestroy.push(gem)
        //     }

        //     return gemsToDestroy
        // }

        // var recursiveCheckGemMatches = function(gem, gemsToDestroy, getNextGemFn) {
        //     var nextGem = getNextGemFn(gem)
        //     if (nextGem && (gem.color == nextGem.color)) {
        //         gemsToDestroy.push(nextGem)
        //         recursiveCheckGemMatches(nextGem, gemsToDestroy, getNextGemFn)
        //     }

        // }

        // var destroyGem = function(gem) {
        //     $scope.board[gem.row][gem.col] = null
        //     $scope.logs.push('Destruiu pedra '+gem.color+' em linha '+gem.row+' coluna '+gem.col)
        // }

        // var refillColumn = function(column) {
        //     var columnCells = _.map($scope.board, column)

        //     // Identify lowest null cell
        //     var destRow = columnCells.lastIndexOf(null)

        //     // Identify last gem among gems which are above the null cells
        //     var gem = _.findLast(_.slice(columnCells, 0, destRow))

        //     bringGemsDown(gem, destRow)

        //     // Create gems in null cells
        //     var columnCells = _.map($scope.board, column)

        //     _.each($scope.board, function(rowGems, row) {
        //         if (!rowGems[column]) {
        //             rowGems[column] = createGem(row, column, availableColors)
        //         }
        //     })
        // }

        // var bringGemsDown = function(gem, destRow) {
        //     if (!gem) {
        //         return
        //     }

        //     var originalRow = gem.row
        //     gem.row = destRow
        //     $scope.board[destRow][gem.col] = gem
        //     $scope.board[originalRow][gem.col] = null

        //     if (originalRow > 0) {
        //         var nextGem = $scope.board[originalRow-1][gem.col]
        //         bringGemsDown(nextGem, destRow-1)
        //     }
        // }

        // Initialize empty board
        // $scope.board =  _.range(ROWS_NUMBER).map(function () {
        //     return Array(COLS_NUMBER)
        // })
        // $scope.logs = []

        // fillBoard($scope.board, 0, 0, null)

    });
