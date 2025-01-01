const tableBody = document.getElementById('table-body');
const displayCollectedList = document.getElementById('displayCollectedList');
let getData;

async function fetchData() {
    tableBody.innerHTML ="";
    const URL = 'https://script.google.com/macros/s/AKfycbyry6bEaKG0SXghh9Gi2mZYy9oXIjJ_SSzLhSc38YmMqMUpFYKb7axBSBrNx5OUfbpIbA/exec';
    
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        getData = await response.json();
        getData = getData.data;
        dataInsert(getData);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

const dataInsert = (data) => {
    for (let i = 1; i < data.length; i++) {
            tableBody.innerHTML += `<tr>
                <th>${data[i].name}</th>
                <th>${data[i].fatherName}</th>
                <th>${data[i].motherName}</th>
                <th>${data[i].email}</th>
                <th>${data[i].dob.split("T")[0]}</th>
                <th>${data[i].gender}</th>
                <th>${data[i].category}</th>
                <th>${data[i].phoneNo}</th>
                <th>${data[i].formNo}</th>
                <th>${data[i].cuetNo}</th>
                <th>${data[i].cuetMarks}</th>
                <th><a href="${data[i].marksheet10th}">Show 10th marksheet</a></th>
                <th><a href="${data[i].marksheet12th}">Show 10th marksheet</a></th>
                <th>${data[i].timestamp.split("T")[0]}</th>
            
            </tr>`
    }
} 

const collectEmail = () => {
    // let emailList = [];
    // for (let i = 1; i < getData.length; i++) {
    //     emailList.push(getData[i].email);
    // }
    let emailList ="";
    for (let i = 1; i < getData.length; i++) {
        emailList += getData[i].email + ", ";
    }
    displayCollectedList.innerHTML = emailList;
    
}

const sendEmail = () => {
    let emailList = "";
    for (let i = 1; i < getData.length; i++) {
        emailList += getData[i].email + ", ";
    }
    window.open(`mailto:${emailList}`);
}


fetchData()   ;          