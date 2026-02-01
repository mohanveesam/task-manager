Angular/Node.js/MongoDb are the main stacks of this appilication,, JWT imlemented, Handling http calls through RXJs, Implemented role level authorisation.
Roles & Responsibilities (Finalized)
A)Admin (Level 1 – Top role)
  1.Create Managers and Users (with username & password).
  2.Edit/Delete users.
  3.Assign roles (Manager/User).
  4.View all projects and tasks (read-only).
B)Manager (Level 2)
  1.Create/Edit/Delete Projects.
  2.Assign Users into Projects.
  3.Create/Edit/Delete Tasks under Projects.
  4.Assign Tasks to Users.
  5.Monitor task updates.
C)User (Level 3)
  1.Login with credentials (given by Admin).
  2.View assigned Projects & Tasks.
  3.Update Task Status (Pending, In Progress, Completed).
