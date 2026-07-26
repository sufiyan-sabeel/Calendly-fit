/**
 * Calendy Fit - Google Contacts Integration Service
 * Import and manage contacts
 */

const PEOPLE_API_BASE = 'https://people.googleapis.com/v1';

export interface GoogleContact {
  resourceName: string;
  name: string;
  email: string;
  phone: string;
  photoUrl: string | null;
}

export class GoogleContactsService {
  /**
   * List authenticated user's Google contacts
   */
  async listContacts(accessToken: string): Promise<GoogleContact[]> {
    const response = await fetch(
      `${PEOPLE_API_BASE}/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`People API: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return (data.connections || []).map((person: any) => ({
      resourceName: person.resourceName,
      name: person.names?.[0]?.displayName || 'Unknown',
      email: person.emailAddresses?.[0]?.value || '',
      phone: person.phoneNumbers?.[0]?.canonicalForm || '',
      photoUrl: person.photos?.[0]?.url || null,
    }));
  }

  /**
   * Search contacts by query
   */
  async searchContacts(accessToken: string, query: string): Promise<GoogleContact[]> {
    const response = await fetch(
      `${PEOPLE_API_BASE}/people:searchContacts?query=${encodeURIComponent(query)}&personFields=names,emailAddresses,phoneNumbers,photos`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) throw new Error('Failed to search contacts');
    const data = await response.json();
    return (data.results || []).map((r: any) => ({
      resourceName: r.person.resourceName,
      name: r.person.names?.[0]?.displayName || 'Unknown',
      email: r.person.emailAddresses?.[0]?.value || '',
      phone: r.person.phoneNumbers?.[0]?.canonicalForm || '',
      photoUrl: r.person.photos?.[0]?.url || null,
    }));
  }

  /**
   * Get a single contact by resource name
   */
  async getContact(accessToken: string, resourceName: string): Promise<GoogleContact | null> {
    const response = await fetch(
      `${PEOPLE_API_BASE}/${resourceName}?personFields=names,emailAddresses,phoneNumbers,photos`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) return null;
    const person = await response.json();
    return {
      resourceName: person.resourceName,
      name: person.names?.[0]?.displayName || 'Unknown',
      email: person.emailAddresses?.[0]?.value || '',
      phone: person.phoneNumbers?.[0]?.canonicalForm || '',
      photoUrl: person.photos?.[0]?.url || null,
    };
  }
}

export const googleContacts = new GoogleContactsService();
