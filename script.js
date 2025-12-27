      let number_showing = document.getElementById("num");
        let myInput = document.getElementById("myInput");
        let btn = document.getElementById("btn");
        let tableContainer = document.getElementById("tableContainer");

        btn.addEventListener("click", () => {
            let myvalue = parseInt(myInput.value);

            number_showing.textContent = myvalue;
            tableContainer.innerHTML = "";


            for (let i = 1; i <= myvalue; i++) {
                let tableHTML = `<div class='table'>
                    <h2>Table of ${i}</h2>`;
                for (let j = 1; j <= 10; j++) {
                    tableHTML += `<div class='row'>${j} x ${i} = ${i * j}</div>`;
                }
                tableHTML += `</div>`;
                tableContainer.innerHTML += tableHTML;
            }
        });