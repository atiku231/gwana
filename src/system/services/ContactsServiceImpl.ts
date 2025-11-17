import type { ContactsService } from '../types/system.types';

export class ContactsServiceImpl implements ContactsService {
  private contacts: any[] = [];

  async getAll(): Promise<any[]> {
    return this.contacts;
  }

  async getById(id: string): Promise<any> {
    return this.contacts.find(c => c.id === id);
  }

  async create(contact: any): Promise<any> {
    const newContact = { ...contact, id: Date.now().toString() };
    this.contacts.push(newContact);
    return newContact;
  }

  async update(id: string, contact: any): Promise<any> {
    const index = this.contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contacts[index] = { ...this.contacts[index], ...contact };
      return this.contacts[index];
    }
    throw new Error('Contact not found');
  }

  async delete(id: string): Promise<void> {
    this.contacts = this.contacts.filter(c => c.id !== id);
  }
}
