  // setup chat scoket
  console.log("hhhhhhhhhhhhhhhh")
  const notifyScoket = new WebSocket(
      'ws://'
      + window.location.host
      + '/ws/notify/'
  );

  // on socket open
  notifyScoket.onopen = function (e) {
      console.log('Socket successfully connected.');
  };

  // on socket close
  notifyScoket.onclose = function (e) {
      console.log('Socket closed unexpectedly');
  };

  // on receiving message on group
  notifyScoket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log(data)
      const message = data.message;
      // Call the setMessage function to add the new li element
      console.log(message)  
      setMessage(message);

  };
  
//   function setMessage(message) {
//       // Create a new li element
//       var newLi = document.createElement('li');

//       // Create a new anchor element
//       var newAnchor = document.createElement('a');
//       newAnchor.className = 'dropdown-item text-wrap';
//       newAnchor.href = '#';
//       newAnchor.textContent = message;

//       // Append the anchor element to the li element
//       newLi.appendChild(newAnchor);

//       // Get the ul element with the id "notify"
//       var ulElement = document.getElementById('notify');

//       // Append the new li element to the ul element
//       ulElement.appendChild(newLi);

//       // getting object of count
//       count = document.getElementById('bellCount').getAttribute('data-count');
//       document.getElementById('bellCount').setAttribute('data-count', parseInt(count) + 1);
//   }
  function setMessage(message) {

      let page = document.querySelector(".page");
      
      
      let request = document.createElement("div");
      request.className = "message-request  fixed-bottom ";
      request.textContent = message;
      
      page.appendChild(request);
      
    }