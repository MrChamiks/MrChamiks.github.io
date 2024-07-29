
    function handleFileSelect(event) {
      const file = event.target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const csv = e.target.result;
          processData(csv);
        };

        reader.readAsText(file);
      }
    }

    function extractTransactions(myArray) {
      const transactionsByItem = {};

      for (const planet in myArray) {
        for (const location in myArray[planet]) {
          for (const product in myArray[planet][location]) {
            const transaction = myArray[planet][location][product];

            if (!transactionsByItem[product]) {
              transactionsByItem[product] = [];
            }

            transactionsByItem[product].push({
              planet,
              location,
              transaction,
            });
          }
        }
      }

      return transactionsByItem;
    }

    function displayResults(results) {
      const resultTable = $('#resultTable');
      const table = $('.resultSection');

      // Corps du tableau
      const rows = [];
      $.each(results, function (item, result) {
        console.log(result);
          if (result.bestSell && result.bestSell.transaction.startsWith('"S')) {
              const row = $('<tr>').appendTo(table);
              $('<td>').text(item).appendTo(row);
              if (!result.bestBuy) {
                  $('<td>').text("N/A").appendTo(row);
                  $('<td>').text("N/A").appendTo(row);
                  $('<td>').text("N/A").appendTo(row);
              } else {
                  $('<td>').text(result.bestBuy.planet).appendTo(row);
                  $('<td>').text(result.bestBuy.location).appendTo(row);
                  $('<td>').text(result.bestBuy.transaction).appendTo(row);
              }
              $('<td>').text(result.bestSell.planet).appendTo(row);
              $('<td>').text(result.bestSell.location).appendTo(row);
              $('<td>').text(result.bestSell.transaction).appendTo(row);

              // Initialiser profit à 0
              let profit = 0;
              if (result.bestBuy) {
                  const buyValue = extractNumericValue(result.bestBuy ? result.bestBuy.transaction : '');
                  const sellValue = extractNumericValue(result.bestSell.transaction);
                  profit = sellValue - buyValue;
              }
              const cellProfit = $('<td>').text(profit).appendTo(row);

              rows.push({ row, profit });
          }
      });

      // Trier les lignes par la colonne "Profit" (du plus grand au plus petit)
      rows.sort((a, b) => b.profit - a.profit);

      // Ajouter les lignes triées au tableau
      $.each(rows, function (index, rowData) {
          table.append(rowData.row);
      });

      resultTable.append(table);
    }

    // Fonction pour extraire la valeur numérique d'une chaîne
    function extractNumericValue(transaction) {
      const match = transaction.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    }


    function ensureNestedArraysExistAndPush(myArray, currentPlanet, colIndex, rowIndex, cellValue) {
      myArray[currentPlanet] = myArray[currentPlanet] || {};
      myArray[currentPlanet][rowIndex] = myArray[currentPlanet][rowIndex] || {};
      myArray[currentPlanet][rowIndex][colIndex] = cellValue;
    }

    function findBestTransactions(allTransactions) {
      const bestTransactions = {};

      for (const item in allTransactions) {
        const transactions = allTransactions[item];

        if (transactions.length > 0) {
          const bestBuyTransaction = transactions.reduce((minBuy, transaction) => {
            const buyMatch = transaction.transaction.match(/"B (\d+)"/);

            if (buyMatch && transaction.transaction.startsWith('"B') && (!minBuy || parseFloat(buyMatch[1]) < parseFloat(minBuy.transaction.match(/"B (\d+)"/)[1]))) {
              return transaction;
            }
            return minBuy;
          }, null);


          const bestSellTransaction = transactions.reduce((maxSell, transaction) => {
            const sellMatch = transaction.transaction.match(/"S (\d+)"/);

            if (sellMatch && transaction.transaction.startsWith('"S') && (!maxSell || parseFloat(sellMatch[1]) > parseFloat(maxSell.transaction.match(/"S (\d+)"/)[1]))) {
              return transaction;
            }
            return maxSell;
          }, null);

          bestTransactions[item] = {
            bestBuy: bestBuyTransaction,
            bestSell: bestSellTransaction,
          };
        }
      }

      return bestTransactions;
    }

    function processData(csv) {
      const rows = csv.split('\n');
      const table = $('<table>');
      const myArray = [];
      currentPlanet = "NULL";

      for (let i = 2; i < rows.length; i++) {
// ################################################## LIGNES I
        const cells = rows[i].split(',');
        const row = $('<tr>');
        let isOnlyFirstColumnFilled = false;

        // CHECK SECTION
        iteration = 0;
        for (let j = 0; j < cells.length; j++) {
          const cellValue = cells[j].trim();
          rowIndexCheck = cells[0].trim();
          if (cellValue && cellValue.trim() !== "" && cellValue.trim() !== "\"\"") {
            iteration++;
          }
        }
        if (iteration == 1) {
            currentPlanet = rowIndexCheck;
        }
        // END

        for (let j = 0; j < cells.length; j++) {
// ################################################## COLONNES J
          const cellValue = cells[j].trim();
          const rowIndex = cells[0].trim();
          const colIndex = rows[0].split(',')[j].trim();

          if (cellValue && cellValue.trim() !== "" && cellValue.trim() !== "\"\"") {

            if (j > 0) {
              ensureNestedArraysExistAndPush(myArray, currentPlanet, colIndex, rowIndex, cellValue);
            }

            const cell = $('<td>').text(cellValue);
            row.append(cell);
          }
        }
        table.append(row);
      }
      const allTransactions = extractTransactions(myArray);
      const bestTransactions = findBestTransactions(allTransactions);
      // Afficher les résultats
      displayResults(bestTransactions);
    }

    $(document).ready(function () {
      $('#csvFileInput').on('change', handleFileSelect);
    });
