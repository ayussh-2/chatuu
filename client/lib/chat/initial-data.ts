export const initialContacts = [
  { id: 1, name: "Alice Smith", online: true, unread: 2 },
  { id: 2, name: "Bob Johnson", online: false, unread: 0 },
  { id: 3, name: "Web Dev Team", online: true, unread: 5 },
];

export const initialMessages = {
  1: [
    { id: 1, content: "Hey there! How are you?", senderId: 1, time: "10:00 AM" },
    { id: 2, content: "I'm doing great! How about you?", senderId: 0, time: "10:02 AM" },
  ],
  2: [
    { id: 1, content: "Did you check the latest PR?", senderId: 2, time: "9:45 AM" },
  ],
  3: [
    { id: 1, content: "Team meeting at 3 PM", senderId: 3, time: "Yesterday" },
  ],
};