// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js";

const socket = io();

function setUserId({sID, message}) {
    //debugger;
    vm.socketID = sID;
};

function runDisconnectMessage(packet) {
    //debugger;
    console.log(packet);
};

function appendNewMessage(msg) {
    // Take the incoming message and push it into the Vue instance
    vm.messages.push(msg);
};

// This is our main Vue instance
const vm = new Vue({
    data: {
        socketID: "",
        messages: [],
        message: "",
        nickName: ""
    },

    methods: {
        dispatchMessage() {
            // Emit a message event and send the message to the server
            console.log("Handle sent message");

            socket.emit('chat_message', {
                content: this.message,
                name: this.nickName || "Some Rando"
            })

            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log('mounted');
    }
}).$mount("#app");

// Some event handling -> These events are coming from the server
socket.addEventListener('connected', setUserId);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);