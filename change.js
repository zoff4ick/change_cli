const scriptArguments = {};

process.on('uncaughtException', (err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
process.argv.slice(2).forEach(argument => {
    const [key, value] = argument.split("=");
    scriptArguments[key] = value;
});

const sum = +scriptArguments['SUM'];
const cost = +scriptArguments['COST'];
if(!sum) throw new Error("Required argument SUM was provided incorrectly or wasn't provided at all. Try again!");
if(!cost) throw new Error("Required argument COST  was provided incorrectly or wasn't provided at all. Try again!");

const transformDollarsToCents = num => num * 100;

function calculateChange(cost, sum) {
    if (cost > sum) throw new Error("Sorry, you provided not enough money to complete the purchase");
    const changeSum = sum - cost;
    let amountOfChangeInCents = transformDollarsToCents(changeSum);
    const centsDenominations = [1, 2, 5, 10, 20, 50];
    const dollarsDenominations = [1, 2, 5, 10, 20, 50, 100];
    const changeInDenominations = [];

    while (amountOfChangeInCents > 0) {
        let coin = transformDollarsToCents(dollarsDenominations.pop()) || centsDenominations.pop();
        let count = Math.floor(amountOfChangeInCents/coin);
        amountOfChangeInCents -= count * coin;
        if (count) changeInDenominations.push({coin: coin/100, count});
    }
    return {
        changeSum,
        changeInDenominations: changeInDenominations,
    };
}

function outputChange(changeSum, changeInDenominations) {
    function parseDenominationsToString(changeInDenominations){
        let stringWithAllDenominations = '';
        changeInDenominations.forEach((denominationWithCount) => {
            const {coin, count} = denominationWithCount;

            const isBiggerThanOneDollar = coin >= 1;
            let stringWithDenomination = (isBiggerThanOneDollar) ? `${coin} доларів, ` : `${transformDollarsToCents(coin)} центів, `;
            if(count > 1) stringWithDenomination = `${count} x ` + stringWithDenomination;
            stringWithAllDenominations += stringWithDenomination;
        });
        return stringWithAllDenominations;
    }

    const changeSumDollars = Math.trunc(changeSum);
    const changeSumCents = (changeSum - changeSumDollars)
        .toFixed(2)
        .slice(2);
    console.log(`Ваша решта: ${changeSumDollars} доларів, ${changeSumCents} центів. По номіналу: ` + parseDenominationsToString(changeInDenominations)); //(по номіналу 2 долари, 10 центів, 5 центів.));
}


const { changeSum, changeInDenominations } = calculateChange(cost, sum);
outputChange(changeSum, changeInDenominations);
