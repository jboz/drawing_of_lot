export const DEFAULT_USER = {
  uid: '',
  email: 'unknown@nobody.com',
  displayName: 'Invité'
};

export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  phoneNumber?: string;
  lastConnection?: string;
}
