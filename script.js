
// GAME DATA 

let games = [
    "Lethal Company",
    "Phasmophobia",
    "Deep Rock Galactic",
    "R.E.P.O",
    "GTFO",
    "BattleBit Remastered",
    "Content Warning",
    "Helldivers 2"
];

let rotation = 0;

// DOM ELEMENTS
// Connect JavaScript variables to HTML elements
const gameInput = document.getElementById("gameInput");
const addButton = document.getElementById("addButton");
const gameList = document.getElementById("gameList");

const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const wheel = document.getElementById("wheel");


// RENDER GAME LIST (store all games in an array and render them as a list on the page)

function renderGames() {

    gameList.innerHTML = ""; // Clear existing list before re-rendering

    games.forEach((game, index) => { // Loop through all games and create a list item for each

        const li = document.createElement("li");

        li.textContent = `${index + 1}. ${game}`;

        gameList.appendChild(li);
    });
}


// UPDATE WHEEL (Refreshes wheel labels and slice count whenever games change)

function updateWheel() {
    myChart.data.labels = games;
    myChart.data.datasets[0].data = games.map(() => 1);
    myChart.update();
}


// CREATE CHART WHEEL (Uses Chart.js to generate the spinning wheel based on the games array)

let myChart = new Chart(wheel, {
    type: "pie",
    data: {
        labels: games,
        datasets: [{
            backgroundColor: [
                "#8b35bc",
                "#b163da",
                "#8b35bc",
                "#b163da",
                "#8b35bc",
                "#b163da",
                "#8b35bc",
                "#b163da"
            ],
            data: games.map(() => 1)
        }]
    },
    options: {
        responsive: true,
        animation: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            datalabels: {
                color: "#fff",
                font: { size: 12 },
                formatter: (_, ctx) => ctx.dataIndex + 1 // Display numbers instead of full game names inside slices
            }
        }
    },
    plugins: [ChartDataLabels]
});


// ADD GAME (Adds a new game entered by the user)

addButton.addEventListener("click", () => {

    const gameName = gameInput.value.trim();
    if (!gameName) return;

    games.push(gameName);
    gameInput.value = "";

    renderGames();
    updateWheel();
});


// SPIN WHEEL (// Randomly choose one game from the array)

spinBtn.addEventListener("click", function () {

    if (games.length === 0) {
        finalValue.textContent = "No games available";
        return;
    }

    spinBtn.disabled = true;

    // Random Game Selector
    const index = Math.floor(Math.random() * games.length); // Calculate the angle size of each slioce

    const selectedGame = games[index];

    // Calculate the center angle of the selected slice
    const segmentAngle = 360 / games.length;

    // Spin the wheel forward multiple full rotations before landing on the selected game to give illusion of randomness
    const targetAngle =
        (index * segmentAngle) +
        (segmentAngle / 2) -90; //-90 offset to aligns wheel with the arrow

    const finalRotation =
        rotation +
        (5 * 360) +
        (360 - targetAngle - (rotation % 360));

    let start = rotation;
    let duration = 7000; // 7 seconds (duration in milliseconds)
    let startTime = null;

    // starts fast and gradually slows down
    function animate(time) {

        if (!startTime) startTime = time;

        let progress = (time - startTime) / duration;

        if (progress > 1) progress = 1;

        // Smooth ease-out animation
        const easeOut = 1 - Math.pow(1 - progress, 4); // Update wheel rotation visually

        rotation = start + (finalRotation - start) * easeOut;

        myChart.options.rotation = rotation; 
        myChart.update();

        if (progress < 1) {
            requestAnimationFrame(animate); // Display the selected game
        }
        else {
            finalValue.textContent = `Selected Game: ${selectedGame}`;
            spinBtn.disabled = false;
        }
    }

    requestAnimationFrame(animate);
});


renderGames();
updateWheel();