(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".unir-screen #unir-user").addEventListener("click", function () {
        let username = app.querySelector(".unir-screen #username").value;
        if (username.length == 0) {
            return;
        }

        uname = username;

        socket.emit("newuser", uname);

        app.querySelector(".unir-screen").classList.remove("activar");
        app.querySelector(".chat-screen").classList.add("activar");
    });

    socket.on("update-header", function (otherUsername) {
        app.querySelector(".chat-screen .header .logo").textContent = `Chat de ${otherUsername}`;
    });

    socket.on("newuser", function (message) {
        renderMessage("actualizar", message);
    });

    app.querySelector(".chat-screen #enviar-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message,
        });
        socket.emit("chat", {
            username: uname,
            text: message,
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
            <div>
                <div class="name">Tu</div>
                <div class="text">${message.text}</div>
            </div>`;
            messageContainer.appendChild(el);
        } else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
            <div>
                <div class="name">${message.username}</div>
                <div class="text">${message.text}</div>
            </div>`;
            messageContainer.appendChild(el);
        } else if (type == "actualizar") {
            let el = document.createElement("div");
            el.setAttribute("class", "actualizar");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
    

})();
