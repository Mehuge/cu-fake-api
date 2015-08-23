cu-fake-api
======================
> Fake API for Camelot Unchained

> *Notice: This library is incomplete, but is being expanded all the time.  Feel free to submit PRs with updates that expand its capabilities*

Overview
========
This module can be imported into UI code to emulate the cuAPI in absense of a real one.  That is, if running inside the game client and cuAPI is available, this module simply returns the real cuAPI, otherwise it returns an object based on CUFakeGameAPI which provides dummy values and some dummy events.  The purpose of this is so that a UI can be developed initially outside of the client (which is much more convenient) before final testing is done inside the client.

Installation
============

```
npm install git+https://github.com/Mehuge/cu-fake-api.git#master
```

Usage
=====

TypeScript / ES6
----------------

```javascript
import * as cuAPI from 'cu-fake-api';
```

JavaScript (Node)
-----------------

```javascript
var cuAPI = require('cu-fake-api');
```

JavaScript (Raw)
----------------

```html
<script src="cu-fake-api/lib/main.js"></script>
```
