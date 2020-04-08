export interface Group {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  label: string;
}

export interface Purpose {
  id: string;
  label: string;
  group: Group;
}
