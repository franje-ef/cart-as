function welcome(person: string) {
    return "<h2>Hello " + person + ", Lets learn TypeScript</h2>";
}

function clickMeButton() {
    let user: string = "MithunVP";
    document.getElementById("divMsg").innerHTML = welcome(user);
}