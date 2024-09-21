const createProfileButton = document.getElementById("create-profile");
const nameBox = document.getElementById("name");
const passBox = document.getElementById("password");
const heplerText = document.getElementById("helper-text");

createProfileButton.addEventListener("click", () => {
  const name = nameBox.value;
  const password = passBox.value;
  if (!name || !password) {
    helperText.textContent = "Please Enter Both Username and password!";
    helperText.style.color = "red";
    heplerText.classList.remove("invisible");
  }
  fetch("/create-profile", {
    method: "POST",
    body: JSON.stringify({ "name": name, "password": password }),
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json()).then(data => {
    if (data["message"]) {
      heplerText.style = "color:green;"
      heplerText.textContent = "Profile Created Successfully! Log in from the Log In Page to Enter the Games!";
      heplerText.classList.remove("invisible");
    }
    else if (data["error"]) {
      heplerText.textContent = "Username is taken. Try a different one!"
    }
  });
});
