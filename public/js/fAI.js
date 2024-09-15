const wss = new WebSocket("ws://localhost:3000");
const weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const d = new Date();
const time = `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
const attendance_table_element = document.getElementById("attendance_table");


document.getElementById("day").innerHTML = weekNames[d.getDay()];
document.getElementById("date").innerHTML = time;
document.getElementById("date2").innerHTML = time;

wss.addEventListener("open", (event)=>{
    //wss.send("Connected with att");
    console.log(`Connected with server`);
});

wss.addEventListener("message", (event)=>{
    console.log(JSON.parse(event.data));
    const student = JSON.parse(event.data);
    const d2 = new Date();
    student[0].mark = "P";
    student[0].time = `${d2.getHours()}:${d2.getMinutes()}`;
    console.log(`Message from server`, event.data);
    console.log(JSON.parse(event.data));
    const row = document.createElement("tr");
    for(let x in student[0]){
        let textNode = document.createTextNode(student[0][x]);
        let temptd = document.createElement("td");
        temptd.appendChild(textNode);
        row.appendChild(temptd);
    }
    attendance_table_element.appendChild(row);
});