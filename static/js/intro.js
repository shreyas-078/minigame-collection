const nameBox = document.getElementById("name");
const passBox = document.getElementById("password");
const helperText = document.getElementById("helper-text");
const enterGameBtn = document.getElementById("enter-game");


enterGameBtn.addEventListener("click", () => {
  const name = nameBox.value;
  const password = passBox.value;
  if (!name || !password) {
    helperText.style = "color: red";
    helperText.textContent = "Please Enter Both Username and Password!";
    helperText.classList.remove("invisible");
    return;
  }
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "same-origin",
    body: JSON.stringify({
      "username": name,
      "password": password
    })
  }).then((res) => res.json()).then((data) => {
    if (data["error"]) {
      helperText.style = "color:red";
      helperText.textContent = "Invalid Credentials.";
      helperText.classList.remove("invisible");
    }
    else {
      console.log(data["stage"])
      window.location.href = `/stage${data["stage"]}`;
    }
  });
});
