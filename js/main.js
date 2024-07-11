// let parent = document.querySelector(".parent");

// let number = 8;
// let q;
// if (number == 8) {
//     q= 3;
// }
// else{
//     q = 2;
// }

// let hold_container_r;
// let hold_container_l;
// let match;
// for (let index = q; index != 0; index--) {
    
//     hold_container_r = document.createElement("div");
//     hold_container_r.classList.add("container-hold-r");
//     parent.appendChild(hold_container_r);
// }

// let array_hold_r = document.querySelectorAll(".container-hold-r");

// let holdnum = number / 2;
// array_hold_r.forEach(e => {

//     for (let indexx = holdnum; indexx != 0; indexx--) {
//         match = document.createElement("div");
//         match.classList.add("match");
//         e.appendChild(match);
//     }
//     holdnum = holdnum / 2;
    
// });


// for (let index = 0; index < q; index++) {
    
//     hold_container_l = document.createElement("div");
//     hold_container_l.classList.add("container-hold-l");
//     parent.appendChild(hold_container_l);
// }
// let array_hold_l = document.querySelectorAll(".container-hold-l");
// holdnum = 1;
// array_hold_l.forEach(e => {

// for (let i = holdnum; i != 0; i--) {

//     match = document.createElement("div");
//         match.classList.add("match");
//         e.appendChild(match);
// }
// holdnum *= 2;

// })

function generateBracket(numPlayers) {
    const parent = document.querySelector(".parent");
    parent.innerHTML = ''; // Clear existing content

    const rounds = numPlayers === 4 ? 2 : 3;
    const playerNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry'];

    // Generate right side
    for (let i = rounds; i > 0; i--) {
        const holdContainerR = document.createElement("div");
        holdContainerR.classList.add("container-hold-r");
        parent.appendChild(holdContainerR);

        const matchesInRound = numPlayers / Math.pow(2, i);
        for (let j = 0; j < matchesInRound; j++) {
            const match = document.createElement("div");
            match.classList.add("match");
            
            if (i === rounds) {
                const player1 = createPlayerElement(playerNames[j * 2]);
                const player2 = createPlayerElement(playerNames[j * 2 + 1]);
                match.appendChild(player1);
                match.appendChild(player2);
            }
            
            holdContainerR.appendChild(match);
        }
    }

    // Generate left side
    for (let i = 1; i <= rounds; i++) {
        const holdContainerL = document.createElement("div");
        holdContainerL.classList.add("container-hold-l");
        parent.appendChild(holdContainerL);

        const matchesInRound = Math.pow(2, i - 1);
        for (let j = 0; j < matchesInRound; j++) {
            const match = document.createElement("div");
            match.classList.add("match");
            holdContainerL.appendChild(match);
        }
    }

    // Add trophy
    const trophy = document.createElement('div');
    trophy.id = 'trophy';
    trophy.textContent = '🏆';
    parent.appendChild(trophy);
}

function createPlayerElement(name) {
    const player = document.createElement('div');
    player.className = 'player_to_tour';

    const img = document.createElement('img');
    img.src = `image/avatar.png`;
    img.alt = name;
    player.appendChild(img);

    const nameSpan = document.createElement('span');
    nameSpan.textContent = name;
    player.appendChild(nameSpan);

    return player;
}

// // Usage
// generateBracket(8); // or generateBracket(4) for a smaller bracket