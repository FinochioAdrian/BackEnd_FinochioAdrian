
    const socket = io();

    const form = document.getElementById('form');
    const input = document.getElementById('input');
    const messages = document.getElementById('messages');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input.value) {
        socket.emit('ChatBot-message', input.value);
        input.value = '';
      }
    });

    socket.on('ChatBot-message', (msg) => {
      const item = document.createElement('li');
      item.textContent = msg;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);
    });
    socket.on('res', (msg) => {
        msg = msg.split('\n')
        msg.forEach(val=> {
          const item = document.createElement('li');
          item.textContent = val;
          messages.appendChild(item);
          
      })
      window.scrollTo(0, document.body.scrollHeight);
    });
 