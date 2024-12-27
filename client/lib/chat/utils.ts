export const formatMessageTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getContactById = (contacts: any[], id: number) => {
  return contacts.find(contact => contact.id === id);
};