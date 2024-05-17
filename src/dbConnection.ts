
export interface ChoresActions {
  onItemClicked: (itemId: string) => void;
  onKeyDown: (e: any, itemId: string) => void;
  addNewItem: (itemId: string) => void;
  updateDescription: (e: any, itemId: string) => void;
}

export interface Chore {
  id: string;
  description: string;
  isDone: boolean;
  isNewItem?: boolean;
  checked?: boolean;
}
const username = localStorage.getItem('ToDoApp');


export async function getUserFromDb(username: string, password: string) {
    await fetch('http://localhost:8000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    localStorage.setItem('ToDoApp', username)
    window.location.href += 'ToDo';
}

export async function getUserChoreList(username: string): Promise<Chore[] | []> {
    return await fetch(`http://localhost:8000/list?username=${username}`, {
      method: 'GET',
    }).then((response) => {return response.json()});
}

export async function updateUserChoreList(choreList:Chore[]) {
  await fetch('http://localhost:8000/list', {
   method: 'PUT',
   headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username, choreList })
  }
);
}

