cu-events
======================
> Camelot Unchained Client Library - Events

---
*Notice: This library is currently under heavy development and is not guaranteed to be in a working state as this time.  This notice will be removed when the library is stable.*

Overview
-----------
Provides the ability to listen for changing data from the client, grouped by topic, with a one-to-one relationship with the handlesSomething flags from .ui files.  So, if writing a UI that deals with character data, listen for 'character' events.

### Installation

> npm install git+https://github.com/Mehuge/cu-events.git#master

### Example (JS)

```javascript
var events = require('cu-events');
 events.on('character', function(data) {
    console.dir(data);
});
```

### Example (TypeScript/ES6)

```typescript
import events from 'cu-events';
events.on('enemytarget', (data: any) => {
    console.dir(data);
});
```

Event Groupings
---------------

Three event groups are currently defined:

**character**

 Handles Character events which include information about
 
- name
- race
- health 
- stamina

**enemytarget**

Handles Enemy Target events which include information about
 
- name
- health 
- stamina
 
**friendlytarget**

Handles Friendly Target events which include information about
 
- name
- health 
- stamina

### Planned Groupings

**chat**

Handle Chat Events

- Chat messages
- Starting chat
- Console messages

These grouping will likely be defined by the UIs that need a data store to monitor events.  An event group doesn't necessarily have to be restricted to cuAPI.On* events, it could include polled data from REST APIs.

### Handles Flags

These are the handles flags currently supported by the client, many will include events and provide information that a UI might need.  Some are to control behaviour.

Handles Flag           | Event Group    | State       | Description
-----------------------|----------------|-------------|----------------
handlesAbilities       | abilities      |             |
handlesAnnouncements   | announcements  |             |
handlesBuilding        | building       | todo        |
handlesCharacter       | character      | implemented | health, stamina, race, name
handlesChat            | chat           |
handlesBeginChat       | chat           |             |
handlesConsole         | chat           | 
handlesConfig          | config         |
handlesEnemyTarget     | enemytarget    | implemented | health, stamina, name
handlesEquippedGear    | equippedgear   | 
handlesFriendlyTarget  | friendlytarget | implemented | health, stamina, name
handlesInput           | input          | ignore      | no associated events
handlesInventory       | inventory      |
handlesLogging         | logging        |
handlesLogin           | login          |

Adding New Event Groups
-----------------------
Let us look at another possible grouping of events, the chat events.  Unlike the character, enemytarget and friendlytarget events where having a single data structure passed for each triggering of the event, for chat events, it makes more sense to send different data depending on the type of event, so with that in mind, here is an example implementation of the chat event group **Note: this is just an example**

To add a new event group, such as handlesChat ('chat') follow these steps:

**Step 1:** In ```src/ts/actions/main.ts``` add a new reflux action for Chat like this:

```javascript
const Chat = Reflux.createAction(['start']);
```

**Step 2:**  Add a new class ```src/ts/classes/HandlesChat.ts``` with the following content:

```javascript
import { Chat as ChatAction } from '../actions/main';
export default class HandlesChat {
	name: string;
	action: any;
    constructor() {
        this.name = 'chat';
        this.action = ChatAction;
    }
    start() {
        this.action.start();
    }
}
```
**Step 3:** Add a new listener ```src/ts/listeners/Chat.ts``` with the following content:

```javascript
import EventEmitter from '../classes/EventEmitter';
function run(emitter : EventEmitter) {
	const info : any = {};
	cuAPI.OnChat((type: number, from: string, 
				body: string, nick: string, 
				iscse: boolean) => {
		info.type = 'chat';
		info.message = {
			type: type,
			from: from,
			body: body,
			nick: nick,
			iscse: iscse
		};
		emitter.emit('chat', info);
	});
	cuAPI.OnBeginChat((mode: number, text: string) => {
		info.type = 'begin';
		info.message = {
			mode: mode,
			text: text
		};
		emitter.emit('chat', info);
	});
	cuAPI.OnConsoleText((text: string) => {
		info.type = 'console';
		info.message = {
			lines = text.split('\n');
		};
		emitter.emit('chat', info);
	});
}
export default class ChatListener {
	listening: boolean = false;
	constructor(type: string) {
		this.listening = false;
	}
	start(emitter : EventEmitter) {
		if (!this.listening) {
			run(emitter);
			this.listening = true;
		}
	}
}
```

**Step 4:** Hook it all up in ```src\ts\main.ts``` as follows

a) Imports

```javascript
import HandlesChat from './classes/HandlesChat';
import ChatListener from './listeners/ChatListener';
```

b) Create a listener in the listener table

```javascript
'chat': new ChatListener(),
```
	
c) Create a handlesChat object

```javascript
const handlesChat : HandlesChat = new HandlesChat();
```

d) Finally, add the handlesChat object to the exports

```javascript
handlesChat,
```

### Example Usage

```javascript
events.on('chat', function(chat) {
	switch(chat.type) {
	case 'begin':
		// handle begin chat (put focus in chat box)
		break;
	case 'chat':
		// handle chat message
		break;
	case 'console':
		// handle console text
		break;
	}		
});
```
