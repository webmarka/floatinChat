var element = $('.floating-chat');
var myStorage = localStorage;

if (!myStorage.getItem('chatID')) {
    myStorage.setItem('chatID', createUUID());
}

setTimeout(function() {
    element.addClass('enter');
}, 1000);

element.click(openElement);

function openElement() {
    var messages = element.find('.messages');
    var textInput = element.find('.text-box');
    element.addClass('transitions');
    element.find('>i').hide();
    element.addClass('expand');
    element.addClass('resizable');
    element.addClass('draggable');
    element.find('.chat').addClass('enter');
    //var strLength = textInput.val().length * 2;
    //textInput.keydown(onMetaAndEnter).prop("disabled", false).focus();
    element.off('click', openElement);
    element.find('.header button').click(closeElement);
    //element.find('#sendMessage').click(sendNewMessage);
    //messages.scrollTop(messages.prop("scrollHeight"));
    element.removeClass('transitions');
}

function removeStyles(elementId) {
    const element = document.getElementById(elementId);
    
    if (element && element.style) {
      ['top', 'left', 'height', 'width'].forEach((prop) => {
        if (element.style[prop] !== undefined) {
          element.style[prop] = '';
        }
      });
    }
}

function closeElement() {
    element.addClass('transitions');
    element.find('.chat').removeClass('enter').hide();
    element.find('>i').show();
    element.removeClass('draggable');
    element.removeClass('resizable');
    element.removeClass('expand');
    element.find('.header button').off('click', closeElement);
    //element.find('#sendMessage').off('click', sendNewMessage);
    //element.find('.text-box').off('keydown', onMetaAndEnter).prop("disabled", true).blur();

    removeStyles(element);

    setTimeout(function() {
        element.find('.chat').removeClass('enter').show()
        element.click(openElement);
        element.removeClass('transitions');
    }, 500);
}

// Make the DIV element draggable:
dragElement(document.getElementById("floatingChat"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "Header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

function sendNewMessage() {
    var userInput = $('.text-box');
    var newMessage = userInput.html().replace(/\<div\>|\<br.*?\>/ig, '\n').replace(/\<\/div\>/g, '').trim().replace(/\n/g, '<br>');

    if (!newMessage) return;

    var messagesContainer = $('.messages');

    messagesContainer.append([
        '<li class="self">',
        newMessage,
        '</li>'
    ].join(''));

    // clean out old message
    userInput.html('');
    // focus on input
    userInput.focus();

    messagesContainer.finish().animate({
        scrollTop: messagesContainer.prop("scrollHeight")
    }, 250);
}

//function onMetaAndEnter(event) {
//    if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
//        sendNewMessage();
//    }
//}
