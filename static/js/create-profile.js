const createProfileButton = document.getElementById("create-profile");
const nameBox = document.getElementById("name");
const passBox = document.getElementById("password");
const helperText = document.getElementById("helper-text");

createProfileButton.addEventListener("click", () => {
  const name = nameBox.value.trim();
  const password = passBox.value.trim();
  if (!name || !password) {
    helperText.textContent = "Please Enter Both Username and password!";
    helperText.style.color = "red";
    helperText.classList.remove("invisible");
    return;
  }
  fetch("/create-profile", {
    method: "POST",
    body: JSON.stringify({ "name": name, "password": password }),
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json()).then(data => {
    if (data["message"]) {
      helperText.style = "color:green;"
      helperText.textContent = "Profile Created Successfully! Log in from the Log In Page to Enter the Games!";
      helperText.classList.remove("invisible");
    }
    else if (data["error"]) {
      helperText.style = "color:red;"
      helperText.textContent = "Username is taken. Try a different one!"
    }
  });
});
