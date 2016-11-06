angular
    .module('Main')
    .constant('ROWS_NUMBER', 8)
    .constant('COLS_NUMBER', 5)
    .constant('AVAILABLE_COLORS', [
        'green',
        'blue',
        'red',
        'orange'
    ])
    .constant('MATCH_SCORES', {
        3: 50,
        4: 100,
        5: 200,
        6: 500,
        7: 1000,
        8: 2000
    })
    .factory('Game', function(Board, Gem, ROWS_NUMBER, COLS_NUMBER, AVAILABLE_COLORS, MATCH_SCORES) {
        game = {
            board: null,
            selectedGem: null,
            data: {
                score: 0,
                logs: []
            }
        }

        game.start = function() {
            game.data.score = 0

            // Flush logs without losing reference
            game.data.logs.length = 0

            game.board = Board(ROWS_NUMBER, COLS_NUMBER)
            fillBoard(0, 0)
        }

        game.selectGem = function(gem) {
            if (gem.selected) {
                gem.selected = false
                game.selectedGem = null
            }
            else if (game.selectedGem) {
                var prevRow = game.selectedGem.row
                var prevCol = game.selectedGem.col

                neighbours = [
                    game.board[prevRow-1] && game.board[prevRow-1][prevCol],
                    game.board[prevRow+1] && game.board[prevRow+1][prevCol],
                    game.board[prevRow][prevCol-1],
                    game.board[prevRow][prevCol+1],
                ]

                if (neighbours.indexOf(gem) < 0) {
                    // selected gem is not a neighbour
                    return
                }

                game.board[prevRow][prevCol] = gem
                game.board[gem.row][gem.col] = game.selectedGem
                game.selectedGem.row = gem.row
                game.selectedGem.col = gem.col
                gem.row = prevRow
                gem.col = prevCol
                game.selectedGem.selected = false
                game.selectedGem = null
                checkMatches()
            }
            else {
                gem.selected = true
                game.selectedGem = gem
            }
        }

        var fillBoard = function(row, col, previousColor) {
            var board = game.board
            if (board[row][col]) {
                return
            }

            // Attempt gem creation until picked color has no matches around gem
            var colorOptions = _.without(AVAILABLE_COLORS, previousColor)
            var gem;
            do {
                gem = Gem(row, col, colorOptions)
                colorOptions = _.without(colorOptions, gem.color)
            }
            while (checkGemMatches(gem).length > 0)

            board[row][col] = gem
            if (row < board.length - 1) {
                fillBoard(row+1, col, gem.color)
            }
            if (col < board[row].length - 1) {
                fillBoard(row, col+1, gem.color)
            }
        }

        checkMatches = function() {
            var gem, gemsToDestroy, columns, score;
            for (var i = 0; i < game.board.length; i++) {
                for (var j = 0; j < game.board[i].length; j++) {
                    gem = game.board[i][j]
                    gemsToDestroy = checkGemMatches(gem)
                    if (gemsToDestroy.length > 0) {
                        score = MATCH_SCORES[gemsToDestroy.length]
                        game.data.score += score
                        game.data.logs.unshift(
                            'Destruiu '+gemsToDestroy.length+' pedras '+gem.color+' (+'+score+' pontos)'
                        )

                        columns = _.uniq(_.map(gemsToDestroy, 'col'))
                        _.map(gemsToDestroy, destroyGem)
                        _.map(columns, refillColumn)

                        i = -1
                        j = -1
                        break
                    }
                }
            }
        }

        var checkGemMatches = function(gem, gemsToIgnore) {
            // Return an array of gems to destroy

            var goUp = function(gem) {
                return game.board[gem.row-1] && game.board[gem.row-1][gem.col]
            }
            var goDown = function(gem) {
                return game.board[gem.row+1] && game.board[gem.row+1][gem.col]
            }
            var goLeft = function(gem) {
                return game.board[gem.row][gem.col-1]
            }
            var goRight = function(gem) {
                return game.board[gem.row][gem.col+1]
            }

            var gemsToDestroy = []

            var verticalGemsToDestroy = []
            recursiveCheckGemMatches(gem, verticalGemsToDestroy, goUp)
            recursiveCheckGemMatches(gem, verticalGemsToDestroy, goDown)

            if (verticalGemsToDestroy.length >= 2) {
                gemsToDestroy = gemsToDestroy.concat(verticalGemsToDestroy)
            }

            var horizontalGemsToDestroy = []
            recursiveCheckGemMatches(gem, horizontalGemsToDestroy, goLeft)
            recursiveCheckGemMatches(gem, horizontalGemsToDestroy, goRight)

            if (horizontalGemsToDestroy.length >= 2) {
                gemsToDestroy = gemsToDestroy.concat(horizontalGemsToDestroy)
            }

            gemsToIgnore = gemsToIgnore || []
            gemsToDestroy = _.difference(gemsToDestroy, gemsToIgnore)

            if (gemsToDestroy.length == 0) {
                return gemsToDestroy
            }

            gemsToDestroy.push(gem)

            // Run matches check on each gem to destroy as they might find new matches
            _.each(gemsToDestroy, function(gem) {
                gemsToDestroy = _.uniq(gemsToDestroy.concat(
                    checkGemMatches(gem, _.union(gemsToDestroy, gemsToIgnore))
                ))
            })

            return gemsToDestroy
        }

        var recursiveCheckGemMatches = function(gem, gemsToDestroy, getNextGemFn) {
            var nextGem = getNextGemFn(gem)
            if (nextGem && (gem.color == nextGem.color)) {
                gemsToDestroy.push(nextGem)
                recursiveCheckGemMatches(nextGem, gemsToDestroy, getNextGemFn)
            }

        }

        var destroyGem = function(gem) {
            game.board[gem.row][gem.col] = null
        }

        var refillColumn = function(column) {
            var columnCells = _.map(game.board, column)

            // Identify lowest null cell
            var destRow = columnCells.lastIndexOf(null)

            // Identify last gem among gems which are above the null cells
            var gem = _.findLast(_.slice(columnCells, 0, destRow))

            bringGemsDown(gem, destRow)

            // Create gems in null cells
            var columnCells = _.map(game.board, column)

            _.each(game.board, function(rowGems, row) {
                if (!rowGems[column]) {
                    rowGems[column] = Gem(row, column, AVAILABLE_COLORS)
                }
            })

            // checkMatches()
        }

        var bringGemsDown = function(gem, destRow) {
            if (!gem) {
                return
            }

            var originalRow = gem.row
            gem.row = destRow
            game.board[destRow][gem.col] = gem
            game.board[originalRow][gem.col] = null

            if (originalRow > 0) {
                var nextGem = game.board[originalRow-1][gem.col]
                bringGemsDown(nextGem, destRow-1)
            }
        }

        return game
    })
    .factory('Board', function() {
        return function(rows, columns) {
            return _.map(_.range(rows), function() { return Array(columns) })
        }
    })
    .factory('Gem', function() {
        return function(row, col, colors) {
            return {
                row: row,
                col: col,
                color: _.sample(colors),
                selected: false
            }
        }
    })
