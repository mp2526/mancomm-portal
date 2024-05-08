# Mancomm React Demo Site

This site is a simple React single page app that utilizes the RESTful API (https://8pwdhsk1hl.execute-api.us-east-1.amazonaws.com/dev/v1) to manipulate and display JSON documents.

It is live at the following URL:

https://master.dbrykdga4z27d.amplifyapp.com/

### Design

To use this site, select a HTML document to be processed from the dropdown and click the "SAVE DOC" button that shows up under the dropdown.

Depending on the size of the document it might take some time to process. Click the "REFRESH LIST" to refresh the grid below it. Once the document has finished processing, it will display in the list. You can then delete the compiled document by selecting the trash can icon or oen the actions dots to see the self explanitory "Open" and "Download" options

### Limitations

This is not a complete production ready site. This is more of a proof of concept with some production ready features missing, such as:

* **UI Design** - This UI is very basic and designed as a demo not necessarily as an indication of the quality of a production site
* **Error Handling** - The error handling is very basic.
* **Data Refreshing** - On production site, I would handle the asynchronous processing differently than just providing a refresh button, such as using a browser/email notification to alert the user the process is finished.
* **Code Quality** - While I tried to write the code as I would for a production app, due to time constraints I did take some shortcuts...
    * **Unit Tests** - Normally I would have started with unit tests and written the code based on my unit test assumptions
    * **Component structure** - While I did break the UI out into a couple of components, it could probably use some refactoring handle the state management better as well as the limited notifications.
